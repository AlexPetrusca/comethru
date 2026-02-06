{{/*
Name used for resources
*/}}
{{- define "comethru.name" -}}
{{- .Values.appName | default .Release.Name -}}
{{- end }}

{{/*
Labels that must match between deployment selector and pods
*/}}
{{- define "comethru.selectorLabels" -}}
app: comethru
instance: {{ .Release.Name }}
{{- end }}