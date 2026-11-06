import React from 'react';

/**
 * ErrorBoundary Component
 * Captura qualquer exceção de renderização em componentes filhos
 * evitando que a aplicação quebre em tela preta.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Spiritfy ErrorBoundary] Erro capturado:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-3xl mb-4">
            🎵
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">O Spiritfy encontrou uma instabilidade temporária</h1>
          <p className="text-sm text-[#B3B3B3] max-w-md mb-6">
            O repertório do palco continua funcionando. Clique no botão abaixo para restaurar a exibição.
          </p>
          <button
            onClick={this.handleReset}
            className="px-6 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-sm transition-all"
          >
            Recarregar Spiritfy
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
