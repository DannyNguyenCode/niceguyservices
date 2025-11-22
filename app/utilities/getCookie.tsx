'use server'

import { cookies } from 'next/headers';
export const getCookies = async (theme: string) => {
    const cookieStore = await cookies();
    cookieStore.set('theme', theme, { path: '/', maxAge: 60 * 60 * 24 * 365 });

}