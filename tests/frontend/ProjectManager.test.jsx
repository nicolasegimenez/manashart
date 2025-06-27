import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectManager from '../../../src/modules/flow/ProjectManager';
import { createActor } from '../../../src/services/actor';

// Mock the actor service
vi.mock('../../../src/services/actor');

describe('ProjectManager', () => {
  it('should create a project successfully', async () => {
    const mockCreateProject = vi.fn().mockResolvedValue({ ok: { id: '123' } });
    createActor.mockResolvedValue({ createProject: mockCreateProject });

    render(<ProjectManager />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Project Name/i), { target: { value: 'Test Project' } });
    fireEvent.change(screen.getByLabelText(/Project Description/i), { target: { value: 'This is a test project.' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Project/i }));

    // Wait for the success message
    await waitFor(() => {
      expect(mockCreateProject).toHaveBeenCalledWith({
        name: 'Test Project',
        description: 'This is a test project.',
        goal: 1000,
      });
    });

    // Check for success message
    expect(screen.getByText(/Project created successfully!/i)).toBeInTheDocument();
  });

  it('should show an error message if project creation fails', async () => {
    const mockCreateProject = vi.fn().mockResolvedValue({ err: { msg: 'Failed to create project' } });
    createActor.mockResolvedValue({ createProject: mockCreateProject });

    render(<ProjectManager />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Project Name/i), { target: { value: 'Test Project' } });
    fireEvent.change(screen.getByLabelText(/Project Description/i), { target: { value: 'This is a test project.' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Project/i }));

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/Error creating project: Failed to create project/i)).toBeInTheDocument();
    });
  });
});
