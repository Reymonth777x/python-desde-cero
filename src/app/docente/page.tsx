import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DocentePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  // The current profile schema has students and administrators only.
  redirect(profile?.is_admin === true ? '/admin' : '/academia');
}
