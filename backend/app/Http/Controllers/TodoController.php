<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TodoController extends Controller
{
    public function index()
    {
        $todos = auth('api')->user()->todos()->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'todos' => $todos
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $todo = auth('api')->user()->todos()->create([
            'title' => $request->title,
            'description' => $request->description,
            'completed' => $request->completed ?? false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Todo created successfully',
            'todo' => $todo
        ], 201);
    }

    public function show($id)
    {
        $todo = Todo::find($id);

        if (!$todo) {
            return response()->json([
                'success' => false,
                'message' => 'Todo not found'
            ], 404);
        }

        // Check if user owns this todo
        if ($todo->user_id !== auth('api')->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'todo' => $todo
        ]);
    }

    public function update(Request $request, $id)
    {
        $todo = Todo::find($id);

        if (!$todo) {
            return response()->json([
                'success' => false,
                'message' => 'Todo not found'
            ], 404);
        }

        // Check if user owns this todo
        if ($todo->user_id !== auth('api')->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $todo->update($request->only(['title', 'description', 'completed']));

        return response()->json([
            'success' => true,
            'message' => 'Todo updated successfully',
            'todo' => $todo
        ]);
    }

    public function destroy($id)
    {
        $todo = Todo::find($id);

        if (!$todo) {
            return response()->json([
                'success' => false,
                'message' => 'Todo not found'
            ], 404);
        }

        // Check if user owns this todo
        if ($todo->user_id !== auth('api')->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $todo->delete();

        return response()->json([
            'success' => true,
            'message' => 'Todo deleted successfully'
        ]);
    }
}
