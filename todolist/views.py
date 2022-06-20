from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.http import HttpResponseRedirect, JsonResponse, HttpResponseBadRequest
from django.views.generic.base import View

import json, time
from todolist.models import TodoList, CompleteList
import datetime

# Create your views here.


def get_all_items():

    all_todo_items = TodoList.objects.all().values()
    all_complete_items = CompleteList.objects.all().values()
    
    #tz = datetime.timezone(datetime.timedelta(hours=+0))
    
    for items in all_complete_items:
        
        day_diff = (datetime.datetime.now() - items['date'] ).days
        time_diff = (datetime.datetime.now() - items['date'] ).seconds
        
        if day_diff < 1:
            if 60*60 < time_diff <= 24*60*60:
                items['date'] = f"{int(time_diff/60/60)}小時前"
                
            elif 60 <time_diff <= 60*60:
                items['date'] = f"{int(time_diff/60)}分鐘前"

            else:
                items['date'] = f"{int(time_diff)}  秒前"
        else:
            items['date'] = items['date'].strftime('%Y/%m/%d')

    return all_todo_items, all_complete_items

def todos(request):

    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    
    if is_ajax:
        
        if request.method == 'GET':
            
            all_todo_items, all_complete_items = get_all_items()
            all_todo_items = list(all_todo_items)
            all_complete_items = list(all_complete_items)
            return JsonResponse({'all_todo':all_todo_items,'all_complete':all_complete_items})
            
        if request.method == 'POST':
            data = json.load(request)
            todo = data['payload']['task']
            
            if todo == "" or todo.isspace():
                all_todo_items, all_complete_items = get_all_items()
                all_todo_items = list(all_todo_items.values())
                all_complete_items = list(all_complete_items.values())

                return JsonResponse({'all_todo':all_todo_items,'all_complete':all_complete_items, 'judge':1})

            new_data = TodoList(content = todo)
            new_data.save()

            all_todo_items, all_complete_items = get_all_items()

            all_todo_items = list(all_todo_items.values())
            all_complete_items = list(all_complete_items.values())

            return JsonResponse({'all_todo':all_todo_items,'all_complete':all_complete_items})
            
        return JsonResponse({'status': 'Invalid request'}, status=400)
    else:
        return HttpResponseBadRequest('Invalid request')

def todolist_app_view(request, *args,**kwargs):
    return render(request, 'todolist.html')

def deleteTodo(request, i):

    data = TodoList.objects.get(id= i)
    data.delete()
    
    return JsonResponse({'status': "success"})

def complete_Todo(request, i):

    data = TodoList.objects.get(id = i)
    
    new_data = CompleteList(content = data.content)
    
    new_data.save()
    data.delete()

    return JsonResponse({'status': "success"})

def home(request):
    return render(request, 'todolist.html')