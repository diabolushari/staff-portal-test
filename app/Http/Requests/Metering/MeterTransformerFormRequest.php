<?php

namespace App\Http\Requests\Metering;

use Illuminate\Foundation\Http\FormRequest;
use Proto\Parameters\ParameterValueServiceClient;
use Proto\Parameters\GetParameterValueRequest;

class MeterTransformerFormRequest extends FormRequest
{
    public function rules(): array
    {
        // Basic validation rules
        $rules = [
            'ctpt_serial' => 'required|string|max:50',
            'ownership_type_id' => 'required|integer',
            'accuracy_class_id' => 'required|integer',
            'burden_id' => 'required|integer',
            'make_id' => 'required|integer',
            'type_id' => 'required|integer',
            'ct_ratio' => 'nullable|string|max:20',
            'pt_ratio' => 'nullable|string|max:20',
        ];

        // Determine selected type (CT or PT) using type_id via gRPC
        $typeId = $this->input('type_id');
        $typeValue = null;

        if ($typeId) {
            try {
                $client = new ParameterValueServiceClient(
                    config('app.consumer_service_grpc_host'),
                    ['credentials' => \Grpc\ChannelCredentials::createInsecure()]
                );
                [$response, $status] = $client->GetParameterValue(
                    (new GetParameterValueRequest())->setId($typeId)
                )->wait();

                if ($status->code === 0 && $response) {
                    $typeValue = $response->getParameterValue();
                }
            } catch (\Exception $e) {
                // fallback: leave $typeValue as null
            }
        }

        // Add CT/PT specific validation
        if ($typeValue === 'CT') {
            $rules['ct_ratio'] = 'required|string|max:20';
            $rules['pt_ratio'] = 'nullable|string|max:20';
        } elseif ($typeValue === 'PT') {
            $rules['pt_ratio'] = 'required|string|max:20';
            $rules['ct_ratio'] = 'nullable|string|max:20';
        }

        return $rules;
    }

    public function authorize(): bool
    {
        return true; // or implement your auth logic
    }
}
