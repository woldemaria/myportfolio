from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
import json

from .models import ContactMessage
from .serializers import ContactMessageSerializer, ProjectSerializer, ProfileSerializer
from .models import Profile
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes

@api_view(['POST'])
def contact_message(request):
    """
    Handles incoming contact form submissions from the portfolio frontend.
    Validates the contact message data and saves it to the database.
    """
    serializer = ContactMessageSerializer(data=request.data)
    
    if serializer.is_valid():
        client_ip = get_client_ip(request)
        contact_msg = serializer.save(ip_address=client_ip)
        
        print("=" * 80)
        print("NEW CONTACT MESSAGE RECEIVED")
        print("=" * 80)
        print(f"Timestamp: {timezone.now().isoformat()}")
        print(f"Name: {contact_msg.name}")
        print(f"Email: {contact_msg.email}")
        print(f"Message: {contact_msg.message}")
        print(f"IP Address: {client_ip}")
        print("=" * 80)
        
        return Response(
            {
                'status': 'success',
                'message': 'Your message has been received successfully!',
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    
    print("=" * 80)
    print("INVALID CONTACT MESSAGE SUBMISSION")
    print("=" * 80)
    print(f"Errors: {json.dumps(serializer.errors, indent=2)}")
    print("=" * 80)
    
    return Response(
        {
            'status': 'error',
            'message': 'There were validation errors with your submission.',
            'errors': serializer.errors
        },
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['GET'])
def projects_list(request):
    """
    Returns a list of software engineering projects for the portfolio.
    Each project includes title, description, tech_stack, and github_link.
    """
    projects_data = [
        {
            'title': 'E-Commerce API Platform',
            'description': 'A full-featured REST API for an e-commerce platform built with Django REST Framework. Includes user authentication, product management, shopping cart functionality, and order processing. Implemented JWT token-based authentication, pagination, filtering, and comprehensive error handling.',
            'tech_stack': ['Django', 'Django REST Framework', 'PostgreSQL', 'JWT', 'Redis', 'Docker'],
            'github_link': 'https://github.com/woldemaria/ecommerce-api'
        },
        {
            'title': 'Task Management Dashboard',
            'description': 'A modern, responsive web application for managing projects and tasks with real-time updates. Features include drag-and-drop task management, team collaboration, deadline tracking, and progress analytics. Built with React, integrated with a Node.js backend, and deployed on AWS.',
            'tech_stack': ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Tailwind CSS', 'AWS'],
            'github_link': 'https://github.com/woldemaria/task-dashboard'
        },
        {
            'title': 'Weather Finder Application',
            'description': 'A weather forecasting application that provides real-time weather data, air quality information, and historical climate trends. Features geolocation-based weather lookup, multi-day forecasts, and interactive weather maps. Integrated with third-party APIs and optimized for mobile responsiveness.',
            'tech_stack': ['React', 'Python', 'Flask', 'OpenWeather API', 'Mapbox', 'PostgreSQL', 'Axios'],
            'github_link': 'https://github.com/woldemaria/weather-finder'
        }
    ]
    
    serializer = ProjectSerializer(projects_data, many=True)
    
    return Response(
        {
            'status': 'success',
            'count': len(projects_data),
            'data': serializer.data
        },
        status=status.HTTP_200_OK
    )

def get_client_ip(request):
    """
    Utility function to extract the client's IP address from the request.
    Handles proxy headers for deployment scenarios.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser, FormParser])
def profile_view(request):
    """GET returns the existing profile (first one) and POST allows uploading/updating avatar and bio."""
    # Ensure single-instance profile for simplicity
    profile, created = Profile.objects.get_or_create(pk=1)

    if request.method == 'GET':
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_200_OK)

    # POST - update fields
    serializer = ProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_200_OK)

    return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
