<?php

namespace App\Http\Middleware;

use App\Support\VarmanApiSupport;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireAdminToken
{
    public function __construct(private readonly VarmanApiSupport $support)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $header = $request->header('Authorization', '');
        $token = '';

        if (is_string($header) && str_starts_with(strtolower($header), 'bearer ')) {
            $token = trim(substr($header, 7));
        }

        if ($token === '') {
            return response()->json(['error' => 'Access token required'], 401);
        }

        $payload = $this->support->decodeToken($token);

        if (! is_array($payload)) {
            return response()->json(['error' => 'Invalid or expired token'], 403);
        }

        $request->attributes->set('admin_user', $payload);

        return $next($request);
    }
}
