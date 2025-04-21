<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'firstname' => 'required|string|max:100',
            'lastname' => 'required|string|max:100',
            'username' => 'required|string|max:100|unique:users,username',
            'password' => 'required|min:6|confirmed'
        ]);

        if ($validate->fails()) {
            return $this->incorrectPayload($validate->errors());
        }

        $hashedPassword = Hash::make($request['password']);

        $user = User::query()->create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'username' => $request->username,
            'password' => $hashedPassword,
        ]);

        event(new Registered($user));

        Auth::login($user);

        $token = $user->createToken('auth_12345')->plainTextToken;

        return response()->json([
            'status' => 200,
            'message' => 'User registered successfully',
            'token' => $token
        ]);
    }

    public function login(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required'
        ]);

        if ($validate->fails()) {
            return $this->incorrectPayload($validate->errors());
        }

        $user = User::query()->where('username', $request['username'])->first();
        $checkedPassword = Hash::check($request['password'], $user->password);

        if (!$user && !$checkedPassword) {
            return $this->incorrectPayload(['Wrong password or username']);
        }

        Auth::login($user);

        $token = $user->createToken('auth_12345')->plainTextToken;

        return response()->json([
            'status' => 200,
            'message' => 'User successfully logged in',
            'token' => $token
        ]);
    }

    public function logout(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->regenerate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
