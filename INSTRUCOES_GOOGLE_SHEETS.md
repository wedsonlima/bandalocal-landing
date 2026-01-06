# Instruções para Configurar Integração com Google Sheets

Este guia explica como configurar o salvamento automático dos contatos do formulário em uma planilha do Google Sheets usando Google Apps Script.

## Pré-requisitos

- Conta Google (Gmail)
- Acesso ao Google Sheets
- Acesso ao Google Apps Script

## Passo 1: Criar a Planilha do Google Sheets

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Dê um nome apropriado (ex: "BandaLocal - Contatos")
4. **Importante**: Copie o ID da planilha da URL
   - A URL será algo como: `https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit`
   - O ID é a parte entre `/d/` e `/edit`
   - Exemplo: Se a URL é `https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit`, o ID é `1a2b3c4d5e6f7g8h9i0j`

## Passo 2: Criar o Google Apps Script

1. Acesse [Google Apps Script](https://script.google.com)
2. Clique em **"Novo projeto"**
3. Dê um nome ao projeto (ex: "BandaLocal Form Handler")
4. Delete o código padrão que aparece
5. Abra o arquivo `google-apps-script.gs` deste projeto
6. Copie todo o conteúdo do arquivo
7. Cole no editor do Google Apps Script
8. **Substitua** `'SEU_SPREADSHEET_ID_AQUI'` pelo ID da planilha que você copiou no Passo 1
   ```javascript
   const SPREADSHEET_ID = '1a2b3c4d5e6f7g8h9i0j'; // Seu ID aqui
   ```
9. Clique em **"Salvar"** (ícone de disquete ou Ctrl+S)

## Passo 3: Fazer Deploy como Web App

1. No Google Apps Script, clique em **"Implantar"** > **"Nova implantação"**
2. Clique no ícone de engrenagem ⚙️ ao lado de **"Tipo"**
3. Selecione **"Aplicativo da Web"**
4. Configure as opções:
   - **Descrição**: "BandaLocal Form Handler" (ou qualquer nome)
   - **Executar como**: "Eu"
   - **Quem tem acesso**: "Qualquer pessoa"
5. Clique em **"Implantar"**
6. Na primeira vez, você precisará autorizar o acesso:
   - Clique em **"Autorizar acesso"**
   - Selecione sua conta Google
   - Clique em **"Avançado"** > **"Ir para [nome do projeto] (não seguro)"**
   - Clique em **"Permitir"**
7. **Copie a URL da Web App** que aparece (algo como: `https://script.google.com/macros/s/...`)
8. Esta URL será usada no próximo passo

## Passo 4: Configurar o Formulário HTML

1. Abra o arquivo `index.html`
2. Procure pela linha que contém:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'SEU_GOOGLE_APPS_SCRIPT_URL_AQUI';
   ```
3. Substitua `'SEU_GOOGLE_APPS_SCRIPT_URL_AQUI'` pela URL que você copiou no Passo 3
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/SEU_ID_AQUI/exec';
   ```
4. Salve o arquivo

## Passo 5: Testar a Integração

1. Abra o arquivo `index.html` no navegador (ou faça deploy do site)
2. Preencha o formulário com dados de teste
3. Clique em **"Entrar na lista de espera"**
4. Você deve ver uma mensagem de sucesso
5. Verifique a planilha do Google Sheets - os dados devem aparecer automaticamente

## Estrutura dos Dados na Planilha

A planilha será criada automaticamente com as seguintes colunas:

| Coluna | Descrição |
|--------|-----------|
| Data/Hora | Data e hora do envio |
| Nome da Banda | Nome da banda cover |
| Cidade/UF | Cidade e estado |
| Instagram | Link do Instagram |
| WhatsApp | Número do WhatsApp |
| YouTube | Link do YouTube (opcional) |
| Estilos | Estilos que a banda toca (opcional) |
| Nome do Contato | Nome da pessoa de contato |
| E-mail | E-mail de contato |
| Observações | Informações extras (opcional) |
| Consentimento LGPD | Se o usuário consentiu (Sim/Não) |

## Solução de Problemas

### Erro: "URL do Google Apps Script não configurada"
- Verifique se você substituiu a URL no arquivo `index.html`
- Certifique-se de que a URL está entre aspas

### Erro: "Dados obrigatórios faltando"
- Verifique se todos os campos obrigatórios do formulário estão preenchidos
- Verifique se o checkbox de consentimento LGPD está marcado

### Erro: "Erro ao processar dados"
- Verifique se o ID da planilha está correto no Google Apps Script
- Verifique se você autorizou o acesso ao Google Sheets
- Verifique os logs no Google Apps Script (Execuções > Ver logs)

### Os dados não aparecem na planilha
- Verifique se a aba "Contatos" foi criada na planilha
- Verifique se o ID da planilha está correto
- Verifique os logs de execução no Google Apps Script

### Erro de CORS
- Certifique-se de que o deploy foi feito como "Web App" e não como "API executável"
- Verifique se "Quem tem acesso" está configurado como "Qualquer pessoa"
- O script inclui a função `doOptions()` para lidar com requisições preflight CORS
- Se ainda houver problemas de CORS, verifique se você copiou todo o código do arquivo `google-apps-script.gs`, incluindo as funções `doOptions()` e `createCorsResponse()`

## Segurança e Privacidade

- Os dados são salvos apenas na sua planilha do Google Sheets
- Apenas você tem acesso à planilha (a menos que compartilhe)
- O Google Apps Script processa os dados e os salva diretamente
- Não há armazenamento intermediário
- Os dados são enviados via HTTPS

## Próximos Passos (Opcional)

- Configure notificações por email quando novos contatos chegarem
- Adicione validações adicionais no Google Apps Script
- Configure filtros automáticos na planilha
- Integre com outras ferramentas (Google Forms, Zapier, etc.)

## Suporte

Se encontrar problemas, verifique:
1. Os logs de execução no Google Apps Script
2. O console do navegador (F12) para erros JavaScript
3. A configuração de permissões do Google Apps Script

Para mais informações sobre Google Apps Script, consulte a [documentação oficial](https://developers.google.com/apps-script).
