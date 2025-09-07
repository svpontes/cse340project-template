-- Type: account_type
-- DROP TYPE IF EXISTS public.account_type;
CREATE TYPE public.account_type AS ENUM ('first-value', 'second-value', 'third-value');
ALTER TYPE public.account_type OWNER TO cse340_39zy;