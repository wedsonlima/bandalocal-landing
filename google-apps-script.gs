/**
 * Google Apps Script para receber dados do formulário e salvar no Google Sheets
 *
 * INSTRUÇÕES:
 * 1. Copie este código para um novo projeto no Google Apps Script (script.google.com)
 * 2. Substitua 'SEU_SPREADSHEET_ID_AQUI' pelo ID da sua planilha do Google Sheets
 * 3. Faça o deploy como Web App (veja instruções na documentação)
 * 4. Copie a URL gerada e cole no arquivo index.html na variável GOOGLE_SCRIPT_URL
 */

// ID da planilha do Google Sheets (encontre na URL da planilha)
const SPREADSHEET_ID = "SEU_SPREADSHEET_ID_AQUI";

// Nome da aba onde os dados serão salvos
const SHEET_NAME = "Contatos";

/**
 * Função para lidar com requisições OPTIONS (preflight CORS)
 * Necessária para permitir requisições cross-origin do navegador
 */
function doOptions() {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
}

/**
 * Função auxiliar para criar resposta com cabeçalhos CORS
 */
function createCorsResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
    });
}

/**
 * Função principal que recebe os dados do formulário via POST
 */
function doPost(e) {
  try {
    // Parse dos dados recebidos (pode ser JSON ou form-urlencoded)
    let data;
    if (e.postData.type === "application/json") {
      data = JSON.parse(e.postData.contents);
    } else {
      // Form-urlencoded: parse manual
      const params = e.parameter;
      data = {
        tipo: params.tipo || "",
        band_name: params.band_name || "",
        city: params.city || "",
        instagram: params.instagram || "",
        whatsapp: params.whatsapp || "",
        youtube: params.youtube || "",
        styles: params.styles || "",
        contact_name: params.contact_name || "",
        email: params.email || "",
        extra: params.extra || "",
        lgpd_consent: params.lgpd_consent || "Não",
      };
    }

    // Validar dados obrigatórios
    if (
      !data.band_name ||
      !data.city ||
      !data.instagram ||
      !data.whatsapp ||
      !data.contact_name ||
      !data.email ||
      !data.lgpd_consent
    ) {
      return createCorsResponse({
        success: false,
        message: "Dados obrigatórios faltando",
      });
    }

    // Determinar tipo (banda ou venue) - padrão é 'banda' se não especificado
    const tipo = data.tipo || "banda";

    // Abrir ou criar a planilha
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    // Se a aba não existir, criar
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Adicionar cabeçalhos
      sheet
        .getRange(1, 1, 1, 12)
        .setValues([
          [
            "Data/Hora",
            "Tipo",
            "Nome da Banda/Estabelecimento",
            "Cidade/UF",
            "Instagram",
            "WhatsApp",
            "YouTube",
            "Estilos",
            "Nome do Contato",
            "E-mail",
            "Observações",
            "Consentimento LGPD",
          ],
        ]);
      // Formatar cabeçalho
      const headerRange = sheet.getRange(1, 1, 1, 12);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#f97316");
      headerRange.setFontColor("#ffffff");
    }

    // Adicionar timestamp
    const timestamp = new Date();
    const formattedDate = Utilities.formatDate(
      timestamp,
      Session.getScriptTimeZone(),
      "dd/MM/yyyy HH:mm:ss"
    );

    // Preparar linha de dados
    const rowData = [
      formattedDate,
      tipo,
      data.band_name || "",
      data.city || "",
      data.instagram || "",
      data.whatsapp || "",
      data.youtube || "",
      data.styles || "",
      data.contact_name || "",
      data.email || "",
      data.extra || "",
      data.lgpd_consent || "Não",
    ];

    // Adicionar linha na planilha
    sheet.appendRow(rowData);

    // Formatar a nova linha (opcional)
    const lastRow = sheet.getLastRow();
    const newRowRange = sheet.getRange(lastRow, 1, 1, 12);
    newRowRange.setBorder(true, true, true, true, true, true);

    // Retornar sucesso com cabeçalhos CORS
    return createCorsResponse({
      success: true,
      message: "Dados salvos com sucesso",
    });
  } catch (error) {
    // Log do erro (visível no Google Apps Script)
    console.error("Erro ao processar formulário:", error);

    // Retornar erro com cabeçalhos CORS
    return createCorsResponse({
      success: false,
      message: "Erro ao processar dados: " + error.toString(),
    });
  }
}

/**
 * Função de teste (opcional) - pode ser executada manualmente para testar
 */
function testDoPost() {
  const testData = {
    tipo: "banda",
    band_name: "Banda Teste",
    city: "São Paulo / SP",
    instagram: "https://instagram.com/teste",
    whatsapp: "+55 11 99999-9999",
    youtube: "https://youtube.com/@teste",
    styles: "Rock 80s",
    contact_name: "João Silva",
    email: "teste@example.com",
    extra: "Teste de envio",
    lgpd_consent: "Sim",
  };

  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData),
    },
  };

  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
