import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SoulProfile from './SoulProfile';

// Mock the actor service
const mockActor = {
  getSoulProfile: vi.fn(),
  createSoulProfile: vi.fn(),
  unlockModule: vi.fn(),
};

// Mock createActor
vi.mock('../../services/actor', () => ({
  createActor: vi.fn(() => Promise.resolve(mockActor)),
}));

// Mock identity
const mockIdentity = {
  getPrincipal: vi.fn(() => ({ toString: () => 'test-principal' })),
};

describe('SoulProfile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Profile Creation', () => {
    it('should render profile creation form when no profile exists', async () => {
      mockActor.getSoulProfile.mockResolvedValue([]);

      render(<SoulProfile identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('Create Your Soul Profile')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
        expect(screen.getByText('Create Profile')).toBeInTheDocument();
      });
    });

    it('should create a new profile when form is submitted', async () => {
      mockActor.getSoulProfile.mockResolvedValue([]);
      mockActor.createSoulProfile.mockResolvedValue({
        ok: {
          username: 'TestUser',
          vibration: 50,
          modules: [
            { name: 'SOUL', enabled: true, level: 1 },
            { name: 'FLOW', enabled: false, level: 0 },
          ],
        },
      });

      render(<SoulProfile identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('Create Your Soul Profile')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText('Enter username'), {
        target: { value: 'TestUser' },
      });
      fireEvent.click(screen.getByText('Create Profile'));

      await waitFor(() => {
        expect(mockActor.createSoulProfile).toHaveBeenCalledWith('TestUser');
        expect(screen.getByText('Soul Profile')).toBeInTheDocument();
        expect(screen.getByText('TestUser')).toBeInTheDocument();
      });
    });

    it('should display error when profile creation fails', async () => {
      mockActor.getSoulProfile.mockResolvedValue([]);
      mockActor.createSoulProfile.mockResolvedValue({
        err: 'Profile already exists',
      });

      render(<SoulProfile identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('Create Your Soul Profile')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText('Enter username'), {
        target: { value: 'ExistingUser' },
      });
      fireEvent.click(screen.getByText('Create Profile'));

      await waitFor(() => {
        expect(screen.getByText('Error: Profile already exists')).toBeInTheDocument();
      });
    });
  });

  describe('Profile Display', () => {
    const mockProfile = {
      username: 'TestUser',
      vibration: 75,
      modules: [
        { name: 'SOUL', enabled: true, level: 1 },
        { name: 'FLOW', enabled: true, level: 1 },
        { name: 'WALLET', enabled: false, level: 0 },
        { name: 'STORE', enabled: false, level: 0 },
      ],
    };

    it('should render existing profile correctly', async () => {
      mockActor.getSoulProfile.mockResolvedValue([mockProfile]);

      render(<SoulProfile identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('Soul Profile')).toBeInTheDocument();
        expect(screen.getByText('TestUser')).toBeInTheDocument();
        expect(screen.getByText('75/100')).toBeInTheDocument();
      });
    });

    it('should display vibration level with progress bar', async () => {
      mockActor.getSoulProfile.mockResolvedValue([mockProfile]);

      render(<SoulProfile identity={mockIdentity} />);

      await waitFor(() => {
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveStyle('width: 75%');
      });
    });

    it('should display modules with correct status', async () => {
      mockActor.getSoulProfile.mockResolvedValue([mockProfile]);

      render(<SoulProfile identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('SOUL')).toBeInTheDocument();
        expect(screen.getByText('FLOW')).toBeInTheDocument();
        expect(screen.getAllByText('Unlocked')).toHaveLength(2);
        expect(screen.getAllByText('Locked')).toHaveLength(2);
      });
    });
  });

  describe('Module Unlocking', () => {
    const mockProfile = {
      username: 'TestUser',
      vibration: 75,
      modules: [
        { name: 'SOUL', enabled: true, level: 1 },
        { name: 'FLOW', enabled: false, level: 0 },
      ],
    };

    it('should attempt to unlock module when button is clicked', async () => {
      mockActor.getSoulProfile.mockResolvedValue([mockProfile]);
      mockActor.unlockModule.mockResolvedValue({ ok: 'FLOW unlocked!' });

      render(<SoulProfile identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('Soul Profile')).toBeInTheDocument();
      });

      const unlockButton = screen.getAllByText('Try to Unlock')[0];
      fireEvent.click(unlockButton);

      await waitFor(() => {
        expect(mockActor.unlockModule).toHaveBeenCalledWith('FLOW');
      });
    });

    it('should show alert on successful unlock', async () => {
      mockActor.getSoulProfile.mockResolvedValue([mockProfile]);
      mockActor.unlockModule.mockResolvedValue({ ok: 'FLOW unlocked!' });
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      render(<SoulProfile identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('Soul Profile')).toBeInTheDocument();
      });

      const unlockButton = screen.getAllByText('Try to Unlock')[0];
      fireEvent.click(unlockButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('FLOW unlocked!');
      });

      alertSpy.mockRestore();
    });

    it('should show error alert on failed unlock', async () => {
      mockActor.getSoulProfile.mockResolvedValue([mockProfile]);
      mockActor.unlockModule.mockResolvedValue({ err: 'Insufficient vibration level' });
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      render(<SoulProfile identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('Soul Profile')).toBeInTheDocument();
      });

      const unlockButton = screen.getAllByText('Try to Unlock')[0];
      fireEvent.click(unlockButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Insufficient vibration level');
      });

      alertSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should display loading state initially', () => {
      mockActor.getSoulProfile.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<SoulProfile identity={mockIdentity} />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should handle actor creation failure', async () => {
      const { createActor } = await import('../../services/actor');
      const originalCreateActor = createActor.getMockImplementation();
      createActor.mockResolvedValue(null);

      render(<SoulProfile identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('Error: Cannot connect to backend')).toBeInTheDocument();
      });

      // Restore the original implementation
      createActor.mockImplementation(originalCreateActor);
    });

    it('should handle profile loading errors', async () => {
      mockActor.getSoulProfile.mockRejectedValue(new Error('Network error'));

      render(<SoulProfile identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText("Error: Network error")).toBeInTheDocument();
      });
    });
  });
});