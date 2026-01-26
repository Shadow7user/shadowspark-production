'use server';

export async function registerUser(formData: {
  email: string;
  password: string;
  name: string;
  role: string;
}) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'Registration failed'
      };
    }
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'An error occurred during registration'
    };
  }
}
