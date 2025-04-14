-- View para contar obras não avaliadas
CREATE OR REPLACE VIEW public.vw_obras_nao_avaliadas AS
SELECT 
    COUNT(*) as total_obras_nao_avaliadas
FROM 
    public.obras
WHERE 
    avaliado = false
ORDER BY 
    total_obras_nao_avaliadas DESC;

-- Comentário sobre a view
COMMENT ON VIEW public.vw_obras_nao_avaliadas IS 'View que retorna a quantidade de obras não avaliadas agrupadas por Estado, Cidade, Tipo de Obra e Status.'; 