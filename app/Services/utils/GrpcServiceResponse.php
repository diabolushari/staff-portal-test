<?php

namespace App\Services\utils;

use Illuminate\Http\RedirectResponse;

/**
 * Unified wrapper for gRPC service layer responses.
 *
 * Controllers / callers can inspect:
 * - $success: boolean overall success flag
 * - $data: domain specific payload (array|null)
 * - $error: RedirectResponse|null (already prepared redirect with errors / flashes)
 * - $rawResponse: underlying gRPC response message (nullable)
 * - $statusCode: gRPC status code (int)
 * - $statusDetails: detailed status / message (string|null)
 */
class GrpcServiceResponse
{
    public readonly bool $success;

    public readonly ?array $data;

    public readonly ?RedirectResponse $error;

    /** @var object|null Underlying protobuf message */
    public readonly ?object $rawResponse;

    public readonly int $statusCode;

    public readonly ?string $statusDetails;

    private function __construct(
        bool $success,
        ?array $data = null,
        ?RedirectResponse $error = null,
        ?object $rawResponse = null,
        int $statusCode = 0,
        ?string $statusDetails = null,
    ) {
        $this->success = $success;
        $this->data = $data;
        $this->error = $error;
        $this->rawResponse = $rawResponse;
        $this->statusCode = $statusCode;
        $this->statusDetails = $statusDetails;
    }

    /**
     * Successful response factory.
     */
    public static function success(?array $data = null, ?object $rawResponse = null, int $statusCode = 0, ?string $statusDetails = null): self
    {
        return new self(true, $data, null, $rawResponse, $statusCode, $statusDetails);
    }

    /**
     * Error response factory.
     *
     * @param  RedirectResponse  $error  Redirect prepared by GrpcErrorService
     */
    public static function error(?RedirectResponse $error, ?object $rawResponse = null, int $statusCode = 2, ?string $statusDetails = null, ?array $data = null): self
    {
        return new self(false, $data, $error, $rawResponse, $statusCode, $statusDetails);
    }

    /** Quickly check if there is an error redirect */
    public function hasValidationError(): bool
    {
        return $this->error !== null;
    }
}
