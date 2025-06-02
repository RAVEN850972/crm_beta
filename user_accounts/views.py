from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import User
from .forms import CustomUserCreationForm, CustomUserChangeForm, ProfileForm
from django.views.decorators.csrf import ensure_csrf_cookie
import json
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from datetime import datetime, timedelta
from django.utils import timezone

@ensure_csrf_cookie
def login_view(request):
    """
    Представление для авторизации пользователей.
    Поддерживает как обычные POST-запросы, так и AJAX.
    """
    if request.method == 'POST':
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            try:
                data = json.loads(request.body)
                username = data.get('username', '')
                password = data.get('password', '')
            except json.JSONDecodeError:
                return JsonResponse({'success': False, 'error': 'Неверный формат данных'}, status=400)
        else:
            username = request.POST.get('username', '')
            password = request.POST.get('password', '')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'redirect': '/',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'full_name': user.get_full_name(),
                        'role': user.role
                    }
                })
            else:
                return redirect('dashboard')
        else:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'error': 'Неверное имя пользователя или пароль'
                }, status=400)
            else:
                messages.error(request, 'Неверное имя пользователя или пароль')
                return render(request, 'user_accounts/login.html')
    
    return render(request, 'user_accounts/login.html')

@login_required
def profile(request):
    """Страница профиля пользователя с расчетом зарплаты"""
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Профиль успешно обновлен!')
            return redirect('profile')
    else:
        form = ProfileForm(instance=request.user)
    
    # Расчет зарплаты для текущего пользователя
    salary_data = None
    period_start = None
    period_end = None
    
    if request.user.role in ['installer', 'manager', 'owner']:
        # Период по умолчанию - текущий месяц
        today = timezone.now()
        period_start = today.replace(day=1)
        period_end = today
        
        # Можно передать параметры периода через GET
        start_date_param = request.GET.get('start_date')
        end_date_param = request.GET.get('end_date')
        
        if start_date_param and end_date_param:
            try:
                period_start = datetime.strptime(start_date_param, '%Y-%m-%d')
                period_end = datetime.strptime(end_date_param, '%Y-%m-%d')
            except ValueError:
                pass
        
        # Импортируем функции расчета зарплаты, если доступны
        try:
            from finance.utils import calculate_installer_salary, calculate_manager_salary, calculate_owner_salary
            
            if request.user.role == 'installer':
                salary_data = calculate_installer_salary(request.user, period_start, period_end)
            elif request.user.role == 'manager':
                salary_data = calculate_manager_salary(request.user, period_start, period_end)
            elif request.user.role == 'owner':
                salary_data = calculate_owner_salary(period_start, period_end)
        except ImportError:
            # Функции расчета зарплаты недоступны
            pass
    
    context = {
        'form': form,
        'salary_data': salary_data,
        'period_start': period_start,
        'period_end': period_end,
        'can_view_salary': request.user.role in ['installer', 'manager', 'owner'],
    }
    
    return render(request, 'user_accounts/profile.html', context)

@login_required
def user_list(request):
    """Список пользователей - ТОЛЬКО для владельца"""
    if request.user.role != 'owner':
        messages.error(request, 'У вас нет прав для просмотра списка пользователей.')
        return redirect('dashboard')
    
    users = User.objects.all().order_by('role', 'username')
    return render(request, 'user_accounts/user_list.html', {'users': users})

@login_required
def user_detail(request, pk):
    """Детальная информация о пользователе - ТОЛЬКО для владельца"""
    if request.user.role != 'owner':
        messages.error(request, 'У вас нет прав для просмотра информации о пользователях.')
        return redirect('dashboard')
    
    user = get_object_or_404(User, pk=pk)
    return render(request, 'user_accounts/user_detail.html', {'user_obj': user})

@login_required
def user_new(request):
    """Создание нового пользователя - ТОЛЬКО для владельца"""
    if request.user.role != 'owner':
        messages.error(request, 'У вас нет прав для создания пользователей.')
        return redirect('dashboard')
    
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, 'Пользователь успешно создан!')
            return redirect('user_detail', pk=user.pk)
    else:
        form = CustomUserCreationForm()
    
    return render(request, 'user_accounts/user_form.html', {'form': form})

@login_required
def user_edit(request, pk):
    """Редактирование пользователя - ТОЛЬКО для владельца"""
    if request.user.role != 'owner':
        messages.error(request, 'У вас нет прав для редактирования пользователей.')
        return redirect('dashboard')
    
    user = get_object_or_404(User, pk=pk)
    
    if request.method == 'POST':
        form = CustomUserChangeForm(request.POST, instance=user)
        if form.is_valid():
            user = form.save()
            messages.success(request, 'Пользователь успешно обновлен!')
            return redirect('user_detail', pk=user.pk)
    else:
        form = CustomUserChangeForm(instance=user)
    
    return render(request, 'user_accounts/user_form.html', {'form': form, 'edit': True})