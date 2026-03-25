import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  X,
  Building2,
  User,
  Mail,
  Briefcase,
  Target,
  FileUp
} from 'lucide-react';

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const PROBLEMAS_OPTIONS = [
  "Desorden financiero",
  "Falta de control de ingresos y gastos",
  "Demasiadas tareas administrativas",
  "Facturación desorganizada",
  "Falta de reportes claros"
];

const ADMIN_OPTIONS = [
  "Excel / Google Sheets",
  "Sistema de gestión",
  "Contador o estudio contable",
  "Yo mismo",
  "Otro"
];

export default function OnboardingForm() {
  const [step, setStep] = useState<Step>(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFileUpload, setShowFileUpload] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    email: '',
    negocio: '',
    administracionActual: '',
    otroMetodo: '',
    problemas: [] as string[],
    objetivo: ''
  });
  const [archivo, setArchivo] = useState<File | null>(null);
  const [problema, setProblema] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nextStep = () => {
    setStep((prev) => (prev + 1) as Step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep((prev) => (prev - 1) as Step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleProblema = (option: string) => {
    setFormData(prev => ({
      ...prev,
      problemas: prev.problemas.includes(option)
        ? prev.problemas.filter(p => p !== option)
        : [...prev.problemas, option]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 6) return;
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("empresa", formData.empresa);
    data.append("email", formData.email);
    data.append("actividad", formData.negocio);
    data.append("metodoAdmin", formData.administracionActual + (formData.otroMetodo ? `: ${formData.otroMetodo}` : ''));
    data.append("problema", `${formData.problemas.join(", ")}${problema ? ' | Detalle: ' + problema : ''}`);
    data.append("mejora", formData.objetivo);

    if (archivo) {
      data.append("files", archivo);
    }

    try {
      const res = await fetch("https://backend-form-zbwy.vercel.app/upload", {
        method: "POST",
        body: data
      });
      if (!res.ok) throw new Error("Error en el servidor");
      setSuccess(true);
    } catch (err) {
      setError("No se pudo enviar. Revisá tu conexión o el archivo.");
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 6) * 100;

  if (success) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md space-y-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full mb-4"><CheckCircle2 size={32} /></div>
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-stone-900 tracking-tight leading-tight">Gracias por completar el diagnóstico</h2>
            <p className="text-stone-500 text-lg">En las próximas 24 horas nos pondremos en contacto.</p>
          </div>
          <div className="pt-8 border-t border-stone-100"><p className="text-stone-400 font-serif italic text-lg">— Gerónimo adm</p></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-sans selection:bg-stone-200">
      <div className="fixed top-0 left-0 w-full h-1.5 bg-stone-100 z-50">
        <motion.div className="h-full bg-stone-900" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
      </div>

      <main className="max-w-2xl mx-auto px-6 py-20 md:py-32">
        <header className="mb-16 space-y-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3 block">Gerónimo adm</span>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Diagnóstico administrativo inicial</h1>
          </motion.div>
        </header>

        <form onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }} className="space-y-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.section key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-xl font-medium flex items-center gap-2"><User size={20} className="text-stone-400" /> Información básica</h3>
                <div className="space-y-4">
                  <input type="text" placeholder="Nombre completo" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 outline-none focus:border-stone-900 transition-all" />
                  <input type="text" placeholder="Empresa" value={formData.empresa} onChange={e => setFormData({...formData, empresa: e.target.value})} className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 outline-none focus:border-stone-900 transition-all" />
                  <input type="email" placeholder="Email de contacto" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 outline-none focus:border-stone-900 transition-all" />
                </div>
              </motion.section>
            )}

            {step === 2 && (
              <motion.section key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-xl font-medium flex items-center gap-2"><Briefcase size={20} className="text-stone-400" /> Tu Negocio</h3>
                <textarea rows={4} placeholder="¿A qué se dedica tu negocio?" value={formData.negocio} onChange={e => setFormData({...formData, negocio: e.target.value})} className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 outline-none focus:border-stone-900 transition-all resize-none" />
              </motion.section>
            )}

            {step === 3 && (
              <motion.section key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-xl font-medium">Administración actual</h3>
                <div className="grid gap-3">
                  {ADMIN_OPTIONS.map(opt => (
                    <label key={opt} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData.administracionActual === opt ? 'border-stone-900 bg-stone-50' : 'bg-white'}`}>
                      <input type="radio" className="hidden" checked={formData.administracionActual === opt} onChange={() => setFormData({...formData, administracionActual: opt})} />
                      <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${formData.administracionActual === opt ? 'border-stone-900' : 'border-stone-300'}`}>
                        {formData.administracionActual === opt && <div className="w-2 h-2 rounded-full bg-stone-900" />}
                      </div>
                      <span className="text-sm font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
                {formData.administracionActual === 'Otro' && (
                  <textarea rows={3} placeholder="¿Cuál?" value={formData.otroMetodo} onChange={e => setFormData({...formData, otroMetodo: e.target.value})} className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 mt-2 outline-none focus:border-stone-900 transition-all" />
                )}
              </motion.section>
            )}

            {step === 4 && (
              <motion.section key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-xl font-medium">Desafíos principales</h3>
                <div className="flex flex-wrap gap-2">
                  {PROBLEMAS_OPTIONS.map(opt => (
                    <button key={opt} type="button" onClick={() => toggleProblema(opt)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${formData.problemas.includes(opt) ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border-stone-200'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
                <textarea rows={4} placeholder="Contanos un poco más..." value={problema} onChange={e => setProblema(e.target.value)} className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 outline-none focus:border-stone-900 transition-all resize-none" />
              </motion.section>
            )}

            {step === 5 && (
              <motion.section key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-xl font-medium flex items-center gap-2"><Target size={20} className="text-stone-400" /> Objetivo</h3>
                <textarea rows={4} placeholder="¿Qué te gustaría mejorar?" value={formData.objetivo} onChange={e => setFormData({...formData, objetivo: e.target.value})} className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 outline-none focus:border-stone-900 transition-all resize-none" />
              </motion.section>
            )}

            {step === 6 && (
              <motion.section key="s6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">¿Adjuntar un archivo?</h3>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowFileUpload(true)} className={`flex-1 py-3 rounded-xl border font-medium ${showFileUpload === true ? 'border-stone-900 bg-stone-50' : 'bg-white'}`}>Sí</button>
                    <button type="button" onClick={() => { setShowFileUpload(false); setArchivo(null); }} className={`flex-1 py-3 rounded-xl border font-medium ${showFileUpload === false ? 'border-stone-900 bg-stone-50' : 'bg-white'}`}>No</button>
                  </div>
                </div>
                {showFileUpload && (
                  <div className="space-y-4">
                    <label htmlFor="file-up" className="block border-2 border-dashed border-stone-200 rounded-2xl p-8 text-center hover:bg-stone-50 cursor-pointer">
                      <input id="file-up" type="file" ref={fileInputRef} onChange={(e) => setArchivo(e.target.files?.[0] || null)} className="hidden" />
                      <Upload size={24} className="mx-auto text-stone-300 mb-2" />
                      <p className="text-sm font-medium">{archivo ? archivo.name : "Click para seleccionar"}</p>
                    </label>
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>

          <div className="pt-8 border-t border-stone-100 flex justify-between items-center">
            {step > 1 && <button type="button" onClick={prevStep} className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors"><ChevronLeft size={20} /> Anterior</button>}
            <button type={step === 6 ? "submit" : "button"} onClick={step === 6 ? undefined : nextStep} disabled={loading} className="ml-auto flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-full font-medium shadow-xl hover:bg-stone-800 transition-all active:scale-95">
              {step === 6 ? (loading ? 'Enviando...' : 'Finalizar diagnóstico') : 'Siguiente'} <ChevronRight size={20} />
            </button>
          </div>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        </form>
      </main>
    </div>
  );
}