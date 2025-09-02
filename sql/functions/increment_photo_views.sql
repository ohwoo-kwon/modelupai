CREATE OR REPLACE FUNCTION increment_photo_views(photo_id_param UUID)
RETURNS void 
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.photos 
  SET views = views + 1
  WHERE photo_id = photo_id_param;
END;
$$ SECURITY DEFINER;

-- 함수 실행 권한 부여
GRANT EXECUTE ON FUNCTION increment_photo_views(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_photo_views(UUID) TO anon;