from django.db import models
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator


class Sentence(models.Model):
    """Model for storing grammatical sentences with analysis."""

    SENTENCE_TYPE_CHOICES = [
        ('declarative', 'Declarative'),
        ('interrogative', 'Interrogative'),
        ('exclamative', 'Exclamative'),
        ('imperative', 'Imperative'),
    ]

    SENTENCE_STRUCTURE_CHOICES = [
        ('simple', 'Simple'),
        ('compound', 'Compound'),
        ('complex', 'Complex'),
        ('compound-complex', 'Compound-Complex'),
    ]

    sentence = models.TextField(
        help_text="The grammatical sentence to analyze"
    )
    sentence_type = models.CharField(
        max_length=20,
        choices=SENTENCE_TYPE_CHOICES,
        help_text="The type of sentence"
    )
    sentence_structure = models.CharField(
        max_length=20,
        choices=SENTENCE_STRUCTURE_CHOICES,
        help_text="The structure of the sentence"
    )
    image = models.ImageField(
        upload_to='sentence_diagrams/',
        null=True,
        blank=True,
        help_text="Optional visual representation of the sentence"
    )
    reed_kellogg_spec = models.JSONField(
        null=True,
        blank=True,
        help_text="JSON specification for Reed-Kellogg diagram"
    )
    dependency_graph_spec = models.JSONField(
        null=True,
        blank=True,
        help_text="JSON specification for dependency graph"
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sentences_created',
        help_text="User who created this sentence"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when sentence was created"
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sentences_updated',
        help_text="User who last updated this sentence"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when sentence was last updated"
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['updated_at']),
        ]

    def __str__(self):
        return self.sentence[:100]


class SentenceRevision(models.Model):
    """Model for tracking edit history and revisions of sentences."""

    sentence = models.ForeignKey(
        Sentence,
        on_delete=models.CASCADE,
        related_name='revisions',
        help_text="Reference to the parent sentence"
    )
    revision_number = models.IntegerField(
        help_text="Sequential revision number"
    )
    sentence_text = models.TextField(
        help_text="The sentence text at this revision"
    )
    sentence_type = models.CharField(
        max_length=20,
        choices=Sentence.SENTENCE_TYPE_CHOICES,
        help_text="Sentence type at this revision"
    )
    sentence_structure = models.CharField(
        max_length=20,
        choices=Sentence.SENTENCE_STRUCTURE_CHOICES,
        help_text="Sentence structure at this revision"
    )
    reed_kellogg_spec = models.JSONField(
        null=True,
        blank=True,
        help_text="Reed-Kellogg diagram spec at this revision"
    )
    dependency_graph_spec = models.JSONField(
        null=True,
        blank=True,
        help_text="Dependency graph spec at this revision"
    )
    changed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sentence_revisions_created',
        help_text="User who made this revision"
    )
    changed_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when this revision was created"
    )
    change_summary = models.TextField(
        blank=True,
        help_text="Optional description of changes in this revision"
    )

    class Meta:
        ordering = ['sentence', 'revision_number']
        unique_together = [['sentence', 'revision_number']]
        indexes = [
            models.Index(fields=['sentence', 'revision_number']),
            models.Index(fields=['changed_at']),
        ]

    def __str__(self):
        return f"{self.sentence} - Revision {self.revision_number}"


class DiagramExplanation(models.Model):
    """Model for storing explanations about diagram elements."""

    EXPLANATION_TYPE_CHOICES = [
        ('node', 'Node'),
        ('edge', 'Edge'),
    ]

    sentence = models.ForeignKey(
        Sentence,
        on_delete=models.CASCADE,
        related_name='explanations',
        help_text="Reference to the parent sentence"
    )
    explanation_type = models.CharField(
        max_length=20,
        choices=EXPLANATION_TYPE_CHOICES,
        help_text="Type of diagram element (node or edge)"
    )
    element_id = models.CharField(
        max_length=255,
        help_text="Identifier for the diagram element (e.g., node ID, edge ID)"
    )
    explanation = models.TextField(
        help_text="Clarification text explaining the diagram decision"
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='diagram_explanations_created',
        help_text="User who created this explanation"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when explanation was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when explanation was last updated"
    )
    ordering_index = models.IntegerField(
        default=0,
        help_text="Order for displaying multiple explanations"
    )

    class Meta:
        ordering = ['sentence', 'ordering_index']
        indexes = [
            models.Index(fields=['sentence', 'element_id']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Explanation for {self.element_id} ({self.explanation_type})"
