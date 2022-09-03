from .models import CompanyInfo
from rest_framework import serializers

class CompanyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = ('__all__')