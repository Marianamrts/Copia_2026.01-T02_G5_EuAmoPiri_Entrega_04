import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import ProfilePage from './ProfilePage'
import * as AuthContext from '../context/AuthContext'

const mockUser = {
  id: 1,
  name: 'Anna Brandão',
  email: 'anna@piri.com',
  role: 'morador',
  profession: 'Desenvolvedora',
  contact: '(62) 99999-0000',
  birthDate: '1995-06-14',
  bio: 'Amo Pirenópolis!',
  avatarUrl: null,
}

const renderPage = () =>
  render(<MemoryRouter><ProfilePage /></MemoryRouter>)

describe('ProfilePage — RF03', () => {
  beforeEach(() => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser,
      updateProfile: vi.fn().mockResolvedValue(mockUser),
      isAuthenticated: true,
      isMorador: true,
    })
  })

  it('exibe nome do usuário em modo leitura', () => {
    renderPage()
    expect(screen.getByText('Anna Brandão')).toBeInTheDocument()
  })

  it('exibe email do usuário em modo leitura', () => {
    renderPage()
    expect(screen.getByText('anna@piri.com')).toBeInTheDocument()
  })

  it('exibe profissão do usuário', () => {
    renderPage()
    expect(screen.getByText('Desenvolvedora')).toBeInTheDocument()
  })

  it('exibe badge com role do usuário', () => {
    renderPage()
    expect(screen.getByText('Morador')).toBeInTheDocument()
  })

  it('exibe botão "Editar Perfil"', () => {
    renderPage()
    expect(
      screen.getByRole('button', { name: /editar perfil/i })
    ).toBeInTheDocument()
  })

  it('exibe formulário de edição ao clicar em "Editar Perfil"', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /editar perfil/i }))
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/profissão/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/biografia/i)).toBeInTheDocument()
  })

  it('pré-preenche campos com dados atuais ao entrar em edição', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /editar perfil/i }))
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue('Anna Brandão')
    expect(screen.getByLabelText(/e-mail/i)).toHaveValue('anna@piri.com')
  })

  it('volta ao modo leitura ao clicar em Cancelar', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /editar perfil/i }))
    await user.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(screen.getByRole('button', { name: /editar perfil/i })).toBeInTheDocument()
  })

  it('chama updateProfile ao submeter com alteração', async () => {
    const updateProfile = vi.fn().mockResolvedValue(mockUser)
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser,
      updateProfile,
      isAuthenticated: true,
      isMorador: true,
    })
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /editar perfil/i }))
    await user.clear(screen.getByLabelText(/biografia/i))
    await user.type(screen.getByLabelText(/biografia/i), 'Nova bio')
    await user.click(screen.getByRole('button', { name: /atualizar perfil/i }))
    await waitFor(() => expect(updateProfile).toHaveBeenCalled())
  })

  it('exibe mensagem de sucesso após salvar', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /editar perfil/i }))
    await user.clear(screen.getByLabelText(/biografia/i))
    await user.type(screen.getByLabelText(/biografia/i), 'Bio atualizada')
    await user.click(screen.getByRole('button', { name: /atualizar perfil/i }))
    await waitFor(() =>
      expect(screen.getByText(/perfil atualizado com sucesso/i)).toBeInTheDocument()
    )
  })

  it('exibe aviso quando nenhuma alteração é detectada', async () => {
    const updateProfile = vi.fn()
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser,
      updateProfile,
      isAuthenticated: true,
      isMorador: true,
    })
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /editar perfil/i }))
    await user.click(screen.getByRole('button', { name: /atualizar perfil/i }))
    await waitFor(() =>
      expect(screen.getByText(/nenhuma alteração detectada/i)).toBeInTheDocument()
    )
    expect(updateProfile).not.toHaveBeenCalled()
  })

  it('rejeita arquivo com tipo inválido', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /editar perfil/i }))

    const file = new File(['gif'], 'photo.gif', { type: 'image/gif' })
    const input = screen.getByLabelText(/alterar foto de perfil/i)
    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText(/jpg ou png/i)).toBeInTheDocument()
  })

  it('rejeita arquivo maior que 5 MB', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /editar perfil/i }))

    const bigContent = new Uint8Array(5 * 1024 * 1024 + 1)
    const file = new File([bigContent], 'big.jpg', { type: 'image/jpeg' })
    const input = screen.getByLabelText(/alterar foto de perfil/i)
    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText(/máximo 5 mb/i)).toBeInTheDocument()
  })

  it('exibe aviso quando usuário não está logado', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      updateProfile: vi.fn(),
      isAuthenticated: false,
      isMorador: false,
    })
    renderPage()
    expect(screen.getByText(/precisa estar logado/i)).toBeInTheDocument()
  })
})
