#!/usr/bin/env python3
"""
Script para otimizar imagens do portfólio
Redimensiona imagens de 1024x1024px para 64x64px (2x para Retina displays)

Requer: pip install Pillow

Uso: python3 optimize-images.py
"""

from PIL import Image
import os

# Configurações
INPUT_DIR = 'assets'
SIZES = {
    'aws.png': 64,
    'cloudwatch.png': 64,
    'shield.png': 64,
    'waf.jpg': 64
}

def optimize_image(input_path, output_path, size):
    """Redimensiona e otimiza uma imagem"""
    try:
        with Image.open(input_path) as img:
            # Converter para RGB se for PNG com transparência
            if img.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background

            # Redimensionar com alta qualidade
            img_resized = img.resize((size, size), Image.Resampling.LANCZOS)

            # Salvar otimizado
            if output_path.endswith('.jpg') or output_path.endswith('.jpeg'):
                img_resized.save(output_path, 'JPEG', quality=85, optimize=True)
            else:
                img_resized.save(output_path, 'PNG', optimize=True)

            # Estatísticas
            original_size = os.path.getsize(input_path)
            new_size = os.path.getsize(output_path)
            reduction = ((original_size - new_size) / original_size) * 100

            print(f"✓ {os.path.basename(input_path)}")
            print(f"  {original_size:,} bytes → {new_size:,} bytes")
            print(f"  Redução: {reduction:.1f}%\n")

            return original_size, new_size

    except Exception as e:
        print(f"✗ Erro ao processar {input_path}: {e}")
        return 0, 0

def main():
    print("=" * 50)
    print("Otimizador de Imagens - Portfólio")
    print("=" * 50 + "\n")

    total_original = 0
    total_new = 0

    for filename, size in SIZES.items():
        input_path = os.path.join(INPUT_DIR, filename)
        output_path = os.path.join(INPUT_DIR, filename)

        if not os.path.exists(input_path):
            print(f"⚠ Arquivo não encontrado: {input_path}\n")
            continue

        # Criar backup
        backup_path = input_path + '.backup'
        if not os.path.exists(backup_path):
            os.rename(input_path, backup_path)
            input_path = backup_path

        orig, new = optimize_image(input_path, output_path, size)
        total_original += orig
        total_new += new

    print("=" * 50)
    print("RESUMO")
    print("=" * 50)
    print(f"Total original: {total_original:,} bytes ({total_original/1024:.1f} KB)")
    print(f"Total otimizado: {total_new:,} bytes ({total_new/1024:.1f} KB)")
    print(f"Economia: {((total_original - total_new) / total_original) * 100:.1f}%")
    print(f"Redução: {(total_original - total_new):,} bytes ({(total_original - total_new)/1024:.1f} KB)")
    print("\n✓ Otimização concluída!")
    print("  Backups salvos em: assets/*.backup")

if __name__ == "__main__":
    main()
