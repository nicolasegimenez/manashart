import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ProjectManager from './ProjectManager';

// Mock the actor service
const mockActor = {
  getProjects: vi.fn(),
  createProject: vi.fn(),
};

vi.mock('../../services/actor', () => ({
  createActor: vi.fn(() => Promise.resolve(mockActor)),
}));

const mockIdentity = {
  getPrincipal: vi.fn(() => ({ toString: () => 'test-principal' })),
};

describe('ProjectManager Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should render the project manager header', async () => {
      mockActor.getProjects.mockResolvedValue([]);

      render(<ProjectManager identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('FLOW - Project Manager')).toBeInTheDocument();
        expect(screen.getByText('New Project')).toBeInTheDocument();
      });
    });

    it('should show empty state when no projects exist', async () => {
      mockActor.getProjects.mockResolvedValue([]);

      render(<ProjectManager identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('No projects yet')).toBeInTheDocument();
        expect(screen.getByText('Create Your First Project')).toBeInTheDocument();
      });
    });
  });

  describe('Project Creation', () => {
    it('should show create form when New Project button is clicked', async () => {
      mockActor.getProjects.mockResolvedValue([]);

      render(<ProjectManager identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('New Project')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('New Project'));

      await waitFor(() => {
        expect(screen.getByText('Create New Project')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Project Title')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Project Description')).toBeInTheDocument();
        expect(screen.getByText('Tokenize this project')).toBeInTheDocument();
      });
    });

    it('should create a project with valid data', async () => {
      mockActor.getProjects.mockResolvedValue([]);
      mockActor.createProject.mockResolvedValue({
        ok: {
          id: 'project-1',
          title: 'My Album',
          description: 'A great album',
          tokenized: true,
          status: { Planning: null },
          budget: 0,
          services: [],
        },
      });

      render(<ProjectManager identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('New Project')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('New Project'));

      await waitFor(() => {
        expect(screen.getByText('Create New Project')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText('Project Title'), { target: { value: 'My Album' } });
      fireEvent.change(screen.getByPlaceholderText('Project Description'), { target: { value: 'A great album' } });
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByText('Create Project'));

      await waitFor(() => {
        expect(mockActor.createProject).toHaveBeenCalledWith('My Album', 'A great album', true);
        expect(screen.getByText('My Album')).toBeInTheDocument();
      });
    });

    it('should not create project with empty title', async () => {
      mockActor.getProjects.mockResolvedValue([]);

      render(<ProjectManager identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('New Project')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('New Project'));

      await waitFor(() => {
        expect(screen.getByText('Create New Project')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Create Project'));

      await waitFor(() => {
        expect(mockActor.createProject).not.toHaveBeenCalled();
      });
    });

    it('should handle project creation errors', async () => {
      mockActor.getProjects.mockResolvedValue([]);
      mockActor.createProject.mockResolvedValue({
        err: 'Soul profile not found',
      });

      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      render(<ProjectManager identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('New Project')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('New Project'));

      await waitFor(() => {
        expect(screen.getByText('Create New Project')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText('Project Title'), { target: { value: 'Test Project' } });
      fireEvent.click(screen.getByText('Create Project'));

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Error: Soul profile not found');
      });

      alertSpy.mockRestore();
    });
  });

  describe('Project Display', () => {
    const mockProjects = [
      {
        id: 'project-1',
        title: 'Music Album',
        description: 'My first album',
        tokenized: true,
        status: { Planning: null },
        budget: 5000,
        services: [
          { name: 'Recording', provider: 'Studio A', cost: 2000, confirmed: true },
          { name: 'Mixing', provider: null, cost: 1500, confirmed: false },
        ],
      },
      {
        id: 'project-2',
        title: 'Art Exhibition',
        description: 'Digital art showcase',
        tokenized: false,
        status: { Active: null },
        budget: 3000,
        services: [],
      },
    ];

    it('should display existing projects', async () => {
      mockActor.getProjects.mockResolvedValue(mockProjects);

      render(<ProjectManager identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('Music Album')).toBeInTheDocument();
        expect(screen.getByText('Art Exhibition')).toBeInTheDocument();
        expect(screen.getByText('My first album')).toBeInTheDocument();
        expect(screen.getByText('Digital art showcase')).toBeInTheDocument();
      });
    });

    it('should show project status with correct styling', async () => {
      mockActor.getProjects.mockResolvedValue(mockProjects);

      render(<ProjectManager identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('Planning')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
      });
    });

    it('should display budget information', async () => {
      mockActor.getProjects.mockResolvedValue(mockProjects);

      render(<ProjectManager identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('5000 tokens')).toBeInTheDocument();
        expect(screen.getByText('3000 tokens')).toBeInTheDocument();
      });
    });

    it('should show tokenization status', async () => {
      mockActor.getProjects.mockResolvedValue(mockProjects);

      render(<ProjectManager identity={mockIdentity} />);

      await waitFor(() => {
        const yesElements = screen.getAllByText('Yes');
        const noElements = screen.getAllByText('No');
        expect(yesElements.length).toBeGreaterThan(0);
        expect(noElements.length).toBeGreaterThan(0);
      });
    });

    it('should display services when available', async () => {
      mockActor.getProjects.mockResolvedValue(mockProjects);

      render(<ProjectManager identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('Services:')).toBeInTheDocument();
        expect(screen.getByText('Recording')).toBeInTheDocument();
        expect(screen.getByText('Mixing')).toBeInTheDocument();
      });
    });
  });

  describe('Form Interactions', () => {
    it('should hide create form when Cancel is clicked', async () => {
      mockActor.getProjects.mockResolvedValue([]);

      render(<ProjectManager identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('New Project')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('New Project'));

      await waitFor(() => {
        expect(screen.getByText('Create New Project')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Cancel'));

      await waitFor(() => {
        expect(screen.queryByText('Create New Project')).not.toBeInTheDocument();
      });
    });

    it('should reset form after successful creation', async () => {
      mockActor.getProjects.mockResolvedValue([]);
      mockActor.createProject.mockResolvedValue({
        ok: {
          id: 'project-1',
          title: 'Test Project',
          description: 'Test Description',
          tokenized: false,
          status: { Planning: null },
          budget: 0,
          services: [],
        },
      });

      render(<ProjectManager identity={mockIdentity} />);

      await waitFor(() => {
        expect(screen.getByText('New Project')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('New Project'));

      await waitFor(() => {
        expect(screen.getByText('Create New Project')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText('Project Title'), { target: { value: 'Test Project' } });
      fireEvent.change(screen.getByPlaceholderText('Project Description'), { target: { value: 'Test Description' } });
      fireEvent.click(screen.getByText('Create Project'));

      await waitFor(() => {
        expect(screen.queryByText('Create New Project')).not.toBeInTheDocument();
        expect(screen.getByText('Test Project')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading message initially', () => {
      mockActor.getProjects.mockImplementation(() => new Promise(() => {}));

      render(<ProjectManager identity={mockIdentity} />);

      expect(screen.getByText('Loading projects...')).toBeInTheDocument();
    });
  });
});