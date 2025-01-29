import axios, { AxiosError } from 'axios';
import { User } from './types';

export const api = axios.create({
    baseURL: 'http://localhost:9393/api',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

type ApiResult = {
    success: boolean;
    errors?: Record<string, string>;
};

// this function adds a new user
export async function addUser(user: User): Promise<ApiResult> {
    try {
        const response = await api.post('/users', user);
        return { success: response.status === 201 };
    } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 400) {
            return { success: false, errors: err.response.data };
        }
        handleAxiosError(err);
        return { success: false };
    }
}

// this function gets all users from the database
export async function getAllUsers(): Promise<User[]> {
    try {
        const response = await api.get<User[]>('/users');
        return response.data;
    } catch (err) {
        handleAxiosError(err);
        throw new Error("Error fetching users");
    }
}

// this function retrieves a user by its ID
export async function getUserById(id: number): Promise<User> {
    try {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    } catch (err) {
        handleAxiosError(err);
        throw new Error(`Error fetching user with ID: ${id}`);
    }
}

// this function updates a user using a PUT request
export async function updateUser(id: number, user: User): Promise<ApiResult> {
    try {
        const response = await api.put(`/users/${id}`, user);
        return { success: response.status === 204 };
    } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 400) {
            return { success: false, errors: err.response.data };
        }
        handleAxiosError(err);
        return { success: false };
    }
}

// this function updates a user partially using a PATCH request
export async function updatePartialUser(id: number, user: Partial<User>): Promise<ApiResult> {
    try {
        const response = await api.patch(`/users/${id}`, user);
        return { success: response.status === 204 };
    } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 400) {
            return { success: false, errors: err.response.data };
        }
        handleAxiosError(err);
        return { success: false };
    }
}

// this function deletes a user by its ID
export async function deleteUserById(id: number): Promise<boolean> {
    try {
        const response = await api.delete(`/users/${id}`);
        return response.status === 204;
    } catch (err) {
        handleAxiosError(err);
        return false;
    }
}

// helper function to handle Axios errors
function handleAxiosError(err: unknown): void {
    if (err instanceof AxiosError) {
        if (err.response) {
            console.error("Server responded with error:", err.response.data);
        } else if (err.request) {
            console.error("No response received from server:", err.request);
        } else {
            console.error("Request setup error:", err.message);
        }
    } else {
        console.error("Unexpected error:", err);
    }
}
