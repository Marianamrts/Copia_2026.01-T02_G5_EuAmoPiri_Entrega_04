/**
 * ORGANISMO — ExperienceForm  (RF05: Cadastro de Relato de Experiência)
 *
 * Formulário para turista registrar sua experiência em um local:
 * avaliação em estrelas, data da visita e texto do relato.
 *
 * Reutilizado em: PlaceDetailPage (inline), CreateExperiencePage (standalone).
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import StarRating from '../atoms/StarRating';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';
import styles from './ExperienceForm.module.css';

export default function ExperienceForm({ onSubmit, onCancel, loading = false, defaultValues = {} }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating:    defaultValues.rating    ?? 0,
      visitDate: defaultValues.visitDate ?? '',
      text:      defaultValues.text      ?? '',
    },
  });

  const rating = watch('rating');
  const [submitError, setSubmitError] = useState(null);

  async function onFormSubmit(data) {
    if (data.rating === 0) return; // validação manual da estrela
    setSubmitError(null);
    try {
      await onSubmit(data);
    } catch {
      setSubmitError('Erro ao enviar relato. Tente novamente.');
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onFormSubmit)} noValidate>
      <h3 className={styles.title}>Meu relato</h3>

      {/* ── Avaliação ── */}
      <div className={styles.ratingField}>
        <span className={styles.ratingLabel}>Avaliação *</span>
        <StarRating
          value={rating}
          onChange={(v) => setValue('rating', v)}
          size="lg"
          label="Avaliação do local"
        />
        {rating === 0 && submitError !== null && (
          <span className={styles.fieldError}>Selecione uma avaliação</span>
        )}
      </div>

      {/* ── Data da visita ── */}
      <FormField
        id="visitDate"
        label="Data da visita"
        type="date"
        registration={register('visitDate', { required: 'Informe a data da visita' })}
        error={errors.visitDate?.message}
      />

      {/* ── Relato textual ── */}
      <FormField
        id="text"
        label="Relato *"
        multiline
        rows={4}
        maxLength={1000}
        placeholder="Conte sua experiência neste local..."
        registration={register('text', {
          required:  'O relato não pode estar vazio',
          minLength: { value: 20, message: 'Mínimo de 20 caracteres' },
          maxLength: { value: 1000, message: 'Máximo de 1000 caracteres' },
        })}
        error={errors.text?.message}
      />

      {submitError && <p className={styles.submitError} role="alert">{submitError}</p>}

      <div className={styles.actions}>
        {onCancel && (
          <Button variant="ghost" type="button" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={loading}>
          Publicar relato
        </Button>
      </div>
    </form>
  );
}
