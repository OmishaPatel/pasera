// Redirect /signup to /login since OAuth handles both
import { redirect } from 'next/navigation';

export default function SignupPage() {
  redirect('/login');
}
