import json
from django.http import JsonResponse, HttpResponseNotAllowed, HttpResponseBadRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Sentence


def cors_headers():
	return {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
	}


def serialize_sentence(s):
	return {
		"id": s.id,
		"sentence": s.sentence,
		"sentence_type": s.sentence_type,
		"sentence_structure": s.sentence_structure,
		"created_at": s.created_at.isoformat() if s.created_at else None,
		"updated_at": s.updated_at.isoformat() if s.updated_at else None,
	}


@csrf_exempt
def sentences_list_create(request):
	if request.method == 'OPTIONS':
		return HttpResponse(status=200, headers=cors_headers())

	if request.method == 'GET':
		q = request.GET.get('q', '')
		if q:
			qs = Sentence.objects.filter(sentence__icontains=q)
		else:
			qs = Sentence.objects.all()
		data = [serialize_sentence(s) for s in qs]
		return JsonResponse(data, safe=False, headers=cors_headers())

	if request.method == 'POST':
		try:
			payload = json.loads(request.body.decode('utf-8'))
		except Exception as e:
			resp = HttpResponseBadRequest(f'Invalid JSON: {str(e)}', headers=cors_headers())
			return resp

		sentence_text = payload.get('sentence')
		if not sentence_text:
			resp = HttpResponseBadRequest('`sentence` is required', headers=cors_headers())
			return resp

		s = Sentence.objects.create(
			sentence=sentence_text,
			sentence_type=payload.get('sentence_type', ''),
			sentence_structure=payload.get('sentence_structure', ''),
		)
		return JsonResponse(serialize_sentence(s), status=201, headers=cors_headers())

	resp = HttpResponseNotAllowed(['GET', 'POST', 'OPTIONS'], headers=cors_headers())
	return resp


@csrf_exempt
def sentence_detail(request, pk):
	if request.method == 'OPTIONS':
		return HttpResponse(status=200, headers=cors_headers())

	s = get_object_or_404(Sentence, pk=pk)

	if request.method == 'GET':
		return JsonResponse(serialize_sentence(s), headers=cors_headers())

	if request.method in ('PUT', 'PATCH'):
		try:
			payload = json.loads(request.body.decode('utf-8'))
		except Exception as e:
			resp = HttpResponseBadRequest(f'Invalid JSON: {str(e)}', headers=cors_headers())
			return resp

		if 'sentence' in payload:
			s.sentence = payload['sentence']
		if 'sentence_type' in payload:
			s.sentence_type = payload['sentence_type']
		if 'sentence_structure' in payload:
			s.sentence_structure = payload['sentence_structure']
		s.save()
		return JsonResponse(serialize_sentence(s), headers=cors_headers())

	if request.method == 'DELETE':
		s.delete()
		resp = HttpResponse(status=204, headers=cors_headers())
		return resp

	resp = HttpResponseNotAllowed(['GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], headers=cors_headers())
	return resp
