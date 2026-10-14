# Victoriano Faces — Landing page de lipo de papada

Projeto estático em HTML, CSS e JavaScript, mantendo a versão editorial escolhida: preto fosco, branco neve, prata acetinada, Liquid Glass em pontos selecionados, animações de revelação ao rolar, seção de equipe, etapas, FAQ e formulário.

## Antes e depois: carrossel contínuo

- A seção de resultados foi convertida em um carrossel horizontal de movimento contínuo, com velocidade moderada (68 segundos por ciclo em telas maiores).
- São **8 cartões de caso**, cada um com um espaço para foto de antes e um de depois — **16 espaços de fotografia no total**.
- O grupo é duplicado por JavaScript para que o movimento reinicie sem um salto visual.
- O movimento pausa ao passar o cursor sobre os cartões, há um botão acessível para pausar/retomar, e a animação é desativada para usuários que preferem movimento reduzido.
- Os cartões continuam sendo placeholders; não representam pessoas reais nem resultados clínicos.

## Abrir no VS Code (Windows)

1. Extraia `victoriano-faces-carousel.zip` para uma pasta.
2. No VS Code, selecione **Arquivo → Abrir Pasta** e escolha essa pasta.
3. Abra `index.html` com Live Server (ou diretamente no navegador).
4. Edite `style.css` para o visual, `index.html` para textos e conteúdo, e `script.js` para interações.

## Configuração antes de publicar

Em `script.js`, configure `SITE_CONFIG.whatsappNumber` com o WhatsApp oficial da clínica, apenas dígitos e com código do país e DDD. O formulário valida os dados e, com o número preenchido, prepara uma mensagem para o usuário enviar pelo WhatsApp; ele não grava em banco de dados nem conecta automaticamente a um CRM.

## Inserir fotos clínicas reais

Em `index.html`, busque por `data-photo-slot="caso-01-antes"` (e os demais `caso-XX-antes` / `caso-XX-depois`). Cada `figure.case-frame` representa um dos 16 espaços. Para trocar um placeholder por uma foto, insira dentro do `figure` um elemento `<img src="images/caso-01-antes.jpg" alt="Fotografia do caso 01 antes do procedimento" loading="lazy">` e remova a `div.case-placeholder-content`. Repita para a imagem depois do mesmo caso. Crie uma pasta `images` dentro do projeto para armazenar as fotografias e mantenha antes/depois da mesma pessoa em condições comparáveis.

Use apenas imagens reais autorizadas, com revisão da equipe responsável e de acordo com as regras profissionais de publicidade aplicáveis. Não publique os marcadores como se fossem resultados clínicos. Antes do lançamento, substitua as imagens editoriais externas por fotos oficiais da clínica e confirme credenciais, contatos, informações clínicas e política de privacidade.
