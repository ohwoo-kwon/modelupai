CREATE OR REPLACE FUNCTION search_photos(search_term TEXT DEFAULT '')
RETURNS TABLE(
  photo_id UUID,
  profile_id UUID,
  image_url VARCHAR(500),
  title VARCHAR(200),
  description TEXT,
  tags JSONB,
  views INTEGER,
  fittings INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  profile JSON
) 
LANGUAGE plpgsql
AS $$
BEGIN
  IF search_term IS NULL OR trim(search_term) = '' THEN
    -- 검색어가 없으면 모든 사진 반환
    RETURN QUERY
    SELECT 
      p.photo_id,
      p.profile_id,
      p.image_url,
      p.title,
      p.description,
      p.tags,
      p.views,
      p.fittings,
      p.created_at,
      p.updated_at,
      CASE 
        WHEN pr.profile_id IS NOT NULL THEN
          json_build_object(
            'profile_id', pr.profile_id,
            'name', pr.name,
            'email', pr.email,
            'avatar_url', pr.avatar_url,
            'is_active', pr.is_active,
            'total_earnings', pr.total_earnings,
            'total_spent', pr.total_spent,
            'created_at', pr.created_at,
            'updated_at', pr.updated_at
          )
        ELSE NULL
      END as profile
    FROM photos p
    LEFT JOIN profiles pr ON p.profile_id = pr.profile_id
    ORDER BY p.created_at DESC;
  ELSE
    -- 검색어가 있으면 다중 필드 검색
    RETURN QUERY
    SELECT 
      p.photo_id,
      p.profile_id,
      p.image_url,
      p.title,
      p.description,
      p.tags,
      p.views,
      p.fittings,
      p.created_at,
      p.updated_at,
      CASE 
        WHEN pr.profile_id IS NOT NULL THEN
          json_build_object(
            'profile_id', pr.profile_id,
            'name', pr.name,
            'email', pr.email,
            'avatar_url', pr.avatar_url,
            'is_active', pr.is_active,
            'total_earnings', pr.total_earnings,
            'total_spent', pr.total_spent,
            'created_at', pr.created_at,
            'updated_at', pr.updated_at
          )
        ELSE NULL
      END as profile
    FROM photos p
    LEFT JOIN profiles pr ON p.profile_id = pr.profile_id
    WHERE 
      -- 사진 제목에서 검색
      p.title ILIKE '%' || search_term || '%' 
      
      -- 태그 JSONB 배열에서 검색 (문자열 변환 방식)
      OR p.tags::text ILIKE '%' || search_term || '%'
      
      -- 사진 설명에서 검색
      OR (p.description IS NOT NULL AND p.description ILIKE '%' || search_term || '%')
      
      -- 프로필 이름에서 검색
      OR pr.name ILIKE '%' || search_term || '%'
    
    ORDER BY p.created_at DESC;
  END IF;
END;
$$;