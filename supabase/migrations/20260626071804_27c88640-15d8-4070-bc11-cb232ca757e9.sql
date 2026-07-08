CREATE POLICY "Users can update their own favorites"
ON public.favorites
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);