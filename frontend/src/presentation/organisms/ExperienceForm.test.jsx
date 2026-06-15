/**
 * TESTES — ExperienceForm
 *   RF05: Cadastro de Relato de Experiência (Turista)
 *   RF12: Comentários em locais
 */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ExperienceForm from './ExperienceForm'

describe('ExperienceForm — RF05 / RF12', () => {
  it('renderiza campos obrigatórios: avaliação, data e relato', () => {
    render(<ExperienceForm onSubmit={vi.fn()} />)
    expect(screen.getByText(/avaliação/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/data da visita/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/relato/i)).toBeInTheDocument()
  })

  it('renderiza 5 botões de estrela interativos', () => {
    render(<ExperienceForm onSubmit={vi.fn()} />)
    const stars = screen.getAllByRole('button', { name: /estrela/i })
    expect(stars).toHaveLength(5)
  })

  it('exibe botão "Publicar relato"', () => {
    render(<ExperienceForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('button', { name: /publicar relato/i })).toBeInTheDocument()
  })

  it('exibe botão Cancelar quando onCancel é fornecido', () => {
    render(<ExperienceForm onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('chama onCancel ao clicar em Cancelar', async () => {
    const user = userEvent.setup()
    const handleCancel = vi.fn()
    render(<ExperienceForm onSubmit={vi.fn()} onCancel={handleCancel} />)
    await user.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(handleCancel).toHaveBeenCalledTimes(1)
  })

  it('exibe erro se relato estiver vazio ao submeter', async () => {
    const user = userEvent.setup()
    render(<ExperienceForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: '5 estrelas' }))
    await user.type(screen.getByLabelText(/data da visita/i), '2026-06-14')
    // não preenche o texto
    await user.click(screen.getByRole('button', { name: /publicar relato/i }))

    await waitFor(() =>
      expect(screen.getByText(/relato não pode estar vazio/i)).toBeInTheDocument()
    )
  })

  it('exibe erro se relato tiver menos de 20 caracteres', async () => {
    const user = userEvent.setup()
    render(<ExperienceForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: '3 estrelas' }))
    await user.type(screen.getByLabelText(/data da visita/i), '2026-06-14')
    await user.type(screen.getByLabelText(/relato/i), 'Curto demais')
    await user.click(screen.getByRole('button', { name: /publicar relato/i }))

    await waitFor(() =>
      expect(screen.getByText(/mínimo de 20 caracteres/i)).toBeInTheDocument()
    )
  })

  it('exibe erro se data da visita não for preenchida', async () => {
    const user = userEvent.setup()
    render(<ExperienceForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: '4 estrelas' }))
    await user.type(
      screen.getByLabelText(/relato/i),
      'Experiência incrível em Pirenópolis, muito recomendo!'
    )
    await user.click(screen.getByRole('button', { name: /publicar relato/i }))

    await waitFor(() =>
      expect(screen.getByText(/informe a data da visita/i)).toBeInTheDocument()
    )
  })

  it('chama onSubmit com dados corretos quando formulário é válido', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ExperienceForm onSubmit={handleSubmit} />)

    await user.click(screen.getByRole('button', { name: '5 estrelas' }))
    await user.type(screen.getByLabelText(/data da visita/i), '2026-06-14')
    await user.type(
      screen.getByLabelText(/relato/i),
      'Lugar incrível, voltaria com certeza. Pirenópolis é maravilhosa!'
    )
    await user.click(screen.getByRole('button', { name: /publicar relato/i }))

    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          rating: 5,
          text: expect.stringContaining('Lugar incrível'),
        })
      )
    )
  })

  it('desabilita botão de submissão durante loading', () => {
    render(<ExperienceForm onSubmit={vi.fn()} loading={true} />)
    expect(screen.getByRole('button', { name: /publicar relato/i })).toBeDisabled()
  })

  it('pré-preenche campos com defaultValues fornecidos', () => {
    render(
      <ExperienceForm
        onSubmit={vi.fn()}
        defaultValues={{ text: 'Relato pré-existente de teste longo', visitDate: '2026-05-01', rating: 3 }}
      />
    )
    expect(screen.getByLabelText(/relato/i)).toHaveValue('Relato pré-existente de teste longo')
  })
})
