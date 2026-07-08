# Guia de Otimização do Portfólio

## 📸 Otimização de Imagens (CRÍTICO - ~200KB de economia)

As imagens atuais estão em 1024x1024px sendo exibidas em 32-64px, desperdiçando ~200KB de banda.

### Opção 1: Script Python Automático (Recomendado)

```bash
# 1. Instalar Pillow
pip install Pillow

# 2. Executar script de otimização
python3 optimize-images.py

# Resultado esperado: 224KB → ~40KB (85% de redução)
```

### Opção 2: Ferramentas Online

Use https://squoosh.app/ ou https://tinypng.com/

1. Faça upload de cada imagem em `assets/`
2. Redimensione para **64x64px** (2x do tamanho exibido para Retina)
3. Salve com qualidade 85%
4. Substitua os arquivos originais

### Opção 3: ImageMagick (Linux/Mac)

```bash
cd assets/

# Redimensionar PNG
convert aws.png -resize 64x64 -quality 90 aws-opt.png
convert cloudwatch.png -resize 64x64 -quality 90 cloudwatch-opt.png
convert shield.png -resize 64x64 -quality 90 shield-opt.png

# Redimensionar JPG
convert waf.jpg -resize 64x64 -quality 85 waf-opt.jpg

# Substituir originais
mv aws-opt.png aws.png
mv cloudwatch-opt.png cloudwatch.png
mv shield-opt.png shield.png
mv waf-opt.jpg waf.jpg
```

## 🎨 Criar Favicon

### Opção 1: Gerador Online (Mais Fácil)

Use https://realfavicongenerator.net/

1. Crie uma imagem 512x512px com suas iniciais "GH" ou logo AWS
2. Faça upload no Real Favicon Generator
3. Baixe o pacote gerado
4. Extraia os arquivos para `assets/`
5. As tags HTML já foram adicionadas no `index.html`

### Opção 2: Manual

Crie manualmente:
- `favicon-16x16.png` (16x16px)
- `favicon-32x32.png` (32x32px)
- `apple-touch-icon.png` (180x180px)

Salve em `assets/`

## 🖼️ Criar Imagens de Compartilhamento Social

Para que compartilhamentos no LinkedIn/Twitter fiquem profissionais:

### Open Graph Image (og-image.png)
- Tamanho: **1200x630px**
- Conteúdo sugerido:
  - Seu nome
  - "Cloud Security Engineer | AWS Specialist"
  - Logo AWS
  - Cores do tema (#8AE234, #729FCF)

### Twitter Card (twitter-card.png)
- Tamanho: **1200x675px**
- Mesmo conteúdo do OG image

Salve ambas em `assets/`

### Ferramentas para criar:
- Canva: https://canva.com (template "LinkedIn Banner")
- Figma: https://figma.com (gratuito)
- Photopea: https://photopea.com (Photoshop online grátis)

## ✅ Checklist de Otimização

- [ ] Otimizar 4 imagens (aws, cloudwatch, shield, waf)
- [ ] Criar favicon (16x16, 32x32, 180x180)
- [ ] Criar OG image (1200x630)
- [ ] Criar Twitter card (1200x675)
- [ ] Testar compartilhamento no LinkedIn
- [ ] Testar performance no Lighthouse
- [ ] Verificar score 95+ em Performance

## 📊 Resultado Esperado

**Antes:**
- Total Transfer: ~280KB
- First Contentful Paint: ~1.8s

**Depois:**
- Total Transfer: ~75KB (-73%)
- First Contentful Paint: ~0.8s (-56%)
- Lighthouse Performance: 95+

## 🚀 Deploy

Após otimizações:

```bash
git add .
git commit -m "Otimizar imagens e adicionar meta tags sociais"
git push origin main
```

O GitHub Pages atualiza automaticamente em ~2 minutos.
