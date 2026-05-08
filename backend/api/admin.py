from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.utils.html import format_html
from .models import Sentence, SentenceRevision, DiagramExplanation


class SentenceRevisionInline(admin.TabularInline):
    """Inline admin for SentenceRevision model."""
    model = SentenceRevision
    extra = 0
    fields = ('revision_number', 'changed_by', 'changed_at', 'change_summary')
    readonly_fields = ('revision_number', 'changed_by', 'changed_at', 'change_summary')
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


class DiagramExplanationInline(admin.TabularInline):
    """Inline admin for DiagramExplanation model."""
    model = DiagramExplanation
    extra = 1
    fields = ('explanation_type', 'element_id', 'explanation', 'ordering_index', 'created_by', 'created_at')
    readonly_fields = ('created_by', 'created_at')


@admin.register(Sentence)
class SentenceAdmin(admin.ModelAdmin):
    """Admin interface for Sentence model."""

    list_display = (
        'sentence_preview',
        'sentence_type_badge',
        'sentence_structure_badge',
        'created_by',
        'updated_at',
    )
    list_filter = ('sentence_type', 'sentence_structure', 'created_at', 'updated_at')
    search_fields = ('sentence',)
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by', 'image_preview')
    
    fieldsets = (
        ('Sentence Content', {
            'fields': ('sentence', 'sentence_type', 'sentence_structure')
        }),
        ('Visual Representation', {
            'fields': ('image', 'image_preview')
        }),
        ('Diagram Specifications', {
            'fields': ('reed_kellogg_spec', 'dependency_graph_spec'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_by', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [DiagramExplanationInline, SentenceRevisionInline]
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)

    def sentence_preview(self, obj):
        """Display a preview of the sentence."""
        preview = obj.sentence[:50]
        if len(obj.sentence) > 50:
            preview += '...'
        return preview
    sentence_preview.short_description = 'Sentence'

    def sentence_type_badge(self, obj):
        """Display sentence type as a colored badge."""
        colors = {
            'declarative': '#28a745',
            'interrogative': '#007bff',
            'exclamative': '#ffc107',
            'imperative': '#dc3545',
        }
        color = colors.get(obj.sentence_type, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            obj.get_sentence_type_display()
        )
    sentence_type_badge.short_description = 'Type'

    def sentence_structure_badge(self, obj):
        """Display sentence structure as a colored badge."""
        colors = {
            'simple': '#6c757d',
            'compound': '#20c997',
            'complex': '#17a2b8',
            'compound-complex': '#fd7e14',
        }
        color = colors.get(obj.sentence_structure, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            obj.get_sentence_structure_display()
        )
    sentence_structure_badge.short_description = 'Structure'

    def image_preview(self, obj):
        """Display a preview of the uploaded image."""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 300px; max-height: 300px;" />',
                obj.image.url
            )
        return 'No image uploaded'
    image_preview.short_description = 'Image Preview'

    def save_model(self, request, obj, form, change):
        """Set created_by or updated_by on save."""
        if not change:  # Creating new object
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(SentenceRevision)
class SentenceRevisionAdmin(admin.ModelAdmin):
    """Admin interface for SentenceRevision model."""

    list_display = (
        'revision_number',
        'sentence_preview',
        'sentence_type',
        'sentence_structure',
        'changed_by',
        'changed_at',
    )
    list_filter = ('sentence', 'sentence_type', 'sentence_structure', 'changed_at')
    search_fields = ('sentence_text', 'sentence__sentence')
    readonly_fields = ('sentence', 'revision_number', 'changed_at', 'changed_by')
    
    fieldsets = (
        ('Revision Information', {
            'fields': ('sentence', 'revision_number', 'changed_by', 'changed_at')
        }),
        ('Sentence Content', {
            'fields': ('sentence_text', 'sentence_type', 'sentence_structure')
        }),
        ('Diagram Specifications', {
            'fields': ('reed_kellogg_spec', 'dependency_graph_spec'),
            'classes': ('collapse',)
        }),
        ('Change Summary', {
            'fields': ('change_summary',)
        }),
    )
    
    date_hierarchy = 'changed_at'
    ordering = ('-changed_at',)

    def sentence_preview(self, obj):
        """Display a preview of the sentence."""
        preview = obj.sentence_text[:50]
        if len(obj.sentence_text) > 50:
            preview += '...'
        return preview
    sentence_preview.short_description = 'Sentence Text'

    def has_add_permission(self, request):
        """Revisions are created automatically, not manually."""
        return False

    def has_delete_permission(self, request, obj=None):
        """Prevent deletion of revision history."""
        return False


@admin.register(DiagramExplanation)
class DiagramExplanationAdmin(admin.ModelAdmin):
    """Admin interface for DiagramExplanation model."""

    list_display = (
        'sentence_link',
        'explanation_type_badge',
        'element_id',
        'explanation_preview',
        'created_by',
        'created_at',
    )
    list_filter = ('explanation_type', 'created_at', 'sentence__sentence_type')
    search_fields = ('element_id', 'explanation', 'sentence__sentence')
    readonly_fields = ('created_at', 'updated_at', 'created_by')
    
    fieldsets = (
        ('Sentence Reference', {
            'fields': ('sentence',)
        }),
        ('Explanation Details', {
            'fields': ('explanation_type', 'element_id', 'explanation')
        }),
        ('Ordering', {
            'fields': ('ordering_index',)
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    date_hierarchy = 'created_at'
    ordering = ('sentence', 'ordering_index', '-created_at')

    def sentence_link(self, obj):
        """Display linked sentence with preview."""
        preview = obj.sentence.sentence[:40]
        if len(obj.sentence.sentence) > 40:
            preview += '...'
        return preview
    sentence_link.short_description = 'Sentence'

    def explanation_type_badge(self, obj):
        """Display explanation type as a colored badge."""
        colors = {
            'node': '#007bff',
            'edge': '#28a745',
        }
        color = colors.get(obj.explanation_type, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            obj.get_explanation_type_display()
        )
    explanation_type_badge.short_description = 'Type'

    def explanation_preview(self, obj):
        """Display a preview of the explanation."""
        preview = obj.explanation[:50]
        if len(obj.explanation) > 50:
            preview += '...'
        return preview
    explanation_preview.short_description = 'Explanation'

    def save_model(self, request, obj, form, change):
        """Set created_by on creation."""
        if not change:  # Creating new object
            obj.created_by = request.user
        super().save_model(request, obj, form, change)