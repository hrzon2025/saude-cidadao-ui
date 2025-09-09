-- Desabilitar confirmação de email no auth
-- Esta configuração permite login imediato após cadastro
UPDATE auth.config SET 
  email_confirmation = false,
  email_change_confirmation = false
WHERE true;