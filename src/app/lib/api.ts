export async function postJsonLogin(endPoint: string, body: any) {
    const res = await fetch(process.env.NEXT_PUBLIC_LARAVEL_API_URL + '/api' + endPoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: "include",
        body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
        throw data;
    }

    return data;
}

export async function postJson(endPoint: string, body: any) {
    const token = localStorage.getItem("token");
    const res = await fetch(process.env.NEXT_PUBLIC_LARAVEL_API_URL + '/api' + endPoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
        throw data;
    }

    return data;
}

export async function getJson(endPoint: string) {
    const token = localStorage.getItem('token');
    const res = await fetch(process.env.NEXT_PUBLIC_LARAVEL_API_URL + '/api' + endPoint, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
        throw data;
    }

    return data;
}