import React, { useState } from 'react';
import { 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const LoginView: React.FC = () => {
  const { login } = useClinic();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      setErrorMessage('Por favor, informe o seu nome de usuário ou matrícula.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Por favor, digite a sua senha de acesso.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(username, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message || 'Erro ao realizar login. Verifique os dados digitados.');
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans">
      
      {/* Container Card */}
      <div className="max-w-lg w-full mx-auto space-y-6">
        
        {/* Institutional Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            {!imgError ? (
              <img 
                src="/brasao_essgt.png" 
                alt="Brasão ESSgt" 
                onError={() => setImgError(true)}
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-xl"
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-red-600 text-white shadow-xl shadow-red-900/50 flex items-center justify-center ring-4 ring-white/10">
                <ShieldCheck className="w-10 h-10 stroke-[2]" />
              </div>
            )}
          </div>

          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-red-400 block mb-1">
              Polícia Militar do Estado de São Paulo
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ESSgt <span className="text-red-500 font-black">• UIS</span>
            </h1>
            <p className="text-sm font-bold text-slate-300 mt-1">
              Escola Superior de Sargentos • <span className="text-red-400">Unidade Integrada de Saúde</span>
            </p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Sistema de Chamada de Senhas, Triagem Militar e Gestão Ambulatorial
            </p>
          </div>
        </div>

        {/* Central Authentication Card */}
        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/80 shadow-2xl shadow-black/40 space-y-6">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Autenticação Obrigatória</span>
            </div>
            <h2 className="text-xl font-black text-slate-800">
              Acesse o seu Posto de Atendimento
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
              O acesso a todos os módulos, triagem, consultórios, relatórios e documentação requer autenticação individual de usuário e senha.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-3 animate-in fade-in duration-150">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-black">Acesso Não Autorizado</p>
                <p className="font-normal text-rose-600 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Usuário ou Matrícula
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="input-login-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ex: admin, dr.roberto, recepcao"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="input-login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha de acesso..."
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="btn-submit-login"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm tracking-wide shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando credenciais...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Posto de Atendimento</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Security & Access Notice */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-start gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Ambiente seguro de uso militar. Todos os acessos e emissões de senhas são registrados para auditoria de atendimento.
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">
            Escola Superior de Sargentos • Centro de Saúde PMESP
          </p>
          <p className="text-[11px] text-slate-400">
            Acesso exclusivo a operadores e profissionais de saúde autorizados • Versão 2.5 Oficial
          </p>
        </div>

      </div>

    </div>
  );
};
