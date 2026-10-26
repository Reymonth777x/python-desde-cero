import { redirect } from 'next/navigation';
import AcademyDashboard from '@/components/AcademyDashboard';
import { createClient } from '@/lib/supabase/server';

export default async function AcademyPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  const { data: progress, error: progressError } = await supabase
    .from('progress')
    .select('module_id, lesson_id, is_completed, best_score')
    .eq('user_id', user.id);

  const displayName = user.user_metadata?.full_name;

  return (
    <AcademyDashboard
      displayName={typeof displayName === 'string' ? displayName : ''}
      progressRows={progress ?? []}
      progressUnavailable={Boolean(progressError)}
    />
  );
}
