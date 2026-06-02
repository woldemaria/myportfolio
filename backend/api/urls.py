from django.urls import path
from . import views

urlpatterns = [
    path('contact', views.contact_message, name='contact-message'),
    path('projects', views.projects_list, name='projects-list'),
    path('profile', views.profile_view, name='profile-view'),
]
