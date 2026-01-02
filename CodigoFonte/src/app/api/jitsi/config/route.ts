import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Busca a configuração do servidor Jitsi da variável de ambiente server-side
    const jitsiServerUrl = process.env.JITSI_SERVER_URL || 'meet.jit.si';
    
    return NextResponse.json({
      serverUrl: jitsiServerUrl,
    });
  } catch (error) {
    console.error('Erro ao buscar configuração do Jitsi:', error);
    
    // Fallback em caso de erro
    return NextResponse.json({
      serverUrl: 'meet.jit.si',
    });
  }
}