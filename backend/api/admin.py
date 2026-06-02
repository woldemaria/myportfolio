from django.contrib import admin
from .models import ContactMessage
from .models import Profile

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at', 'ip_address')
    list_filter = ('created_at',)
    search_fields = ('name', 'email')
    readonly_fields = ('created_at', 'ip_address')
    ordering = ('-created_at',)
admin.site.register(Profile)
