-- Fix RLS policy for properties table - ALL policy needs explicit with_check
DROP POLICY IF EXISTS "Admins and editors can manage properties" ON public.properties;

CREATE POLICY "Admins and editors can insert properties"
ON public.properties
FOR INSERT
WITH CHECK (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can update properties"
ON public.properties
FOR UPDATE
USING (is_admin_or_editor(auth.uid()))
WITH CHECK (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can delete properties"
ON public.properties
FOR DELETE
USING (is_admin_or_editor(auth.uid()));

-- Fix RLS policy for property_images table
DROP POLICY IF EXISTS "Admins and editors can manage images" ON public.property_images;

CREATE POLICY "Admins and editors can insert images"
ON public.property_images
FOR INSERT
WITH CHECK (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can update images"
ON public.property_images
FOR UPDATE
USING (is_admin_or_editor(auth.uid()))
WITH CHECK (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can delete images"
ON public.property_images
FOR DELETE
USING (is_admin_or_editor(auth.uid()));

-- Fix RLS policy for categories table
DROP POLICY IF EXISTS "Admins and editors can manage categories" ON public.categories;

CREATE POLICY "Admins and editors can insert categories"
ON public.categories
FOR INSERT
WITH CHECK (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can update categories"
ON public.categories
FOR UPDATE
USING (is_admin_or_editor(auth.uid()))
WITH CHECK (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can delete categories"
ON public.categories
FOR DELETE
USING (is_admin_or_editor(auth.uid()));

-- Fix RLS policy for site_settings table
DROP POLICY IF EXISTS "Admins and editors can manage settings" ON public.site_settings;

CREATE POLICY "Admins and editors can insert settings"
ON public.site_settings
FOR INSERT
WITH CHECK (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can update settings"
ON public.site_settings
FOR UPDATE
USING (is_admin_or_editor(auth.uid()))
WITH CHECK (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can delete settings"
ON public.site_settings
FOR DELETE
USING (is_admin_or_editor(auth.uid()));