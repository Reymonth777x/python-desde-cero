DROP POLICY IF EXISTS "No direct quiz answer key access" ON private.quiz_answer_key;
CREATE POLICY "No direct quiz answer key access"
ON private.quiz_answer_key
FOR ALL
TO public
USING (false)
WITH CHECK (false);
DROP POLICY IF EXISTS "No direct quiz attempt access" ON private.quiz_attempts;
CREATE POLICY "No direct quiz attempt access"
ON private.quiz_attempts
FOR ALL
TO public
USING (false)
WITH CHECK (false);
