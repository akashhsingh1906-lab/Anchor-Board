package com.saas.project.config;

import com.saas.project.entity.*;
import com.saas.project.repository.ProjectRepository;
import com.saas.project.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Seeds a couple of realistic projects/tasks on startup so the dashboard and
 * Kanban board have real data the first time anyone logs in, instead of
 * shipping empty until a user manually creates content.
 *
 * Runs through the repositories directly (not the service layer) because
 * {@code @PreAuthorize}-guarded service methods require an authenticated
 * request context that doesn't exist during application startup.
 */
@Component
public class DemoDataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DemoDataSeeder.class);
    private static final Long DEMO_TENANT_ID = 1L;

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public DemoDataSeeder(ProjectRepository projectRepository, TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    public void run(String... args) {
        if (projectRepository.count() > 0) {
            return;
        }

        Project website = newProject("Website Relaunch", "WEB",
                "Rebuild the marketing site on the new design system.",
                ProjectStatus.ACTIVE, ProjectPriority.HIGH);
        Project mobile = newProject("Mobile App v2", "MOB",
                "Native iOS/Android client for the AnchorBoard-SaaS platform.",
                ProjectStatus.PLANNING, ProjectPriority.MEDIUM);

        website = projectRepository.save(website);
        mobile = projectRepository.save(mobile);

        seedTask(website.getId(), "WEB-1", "Set up design tokens", TaskStatus.DONE, TaskPriority.HIGH);
        seedTask(website.getId(), "WEB-2", "Build responsive navigation", TaskStatus.IN_PROGRESS, TaskPriority.HIGH);
        seedTask(website.getId(), "WEB-3", "Wire contact form to backend", TaskStatus.TODO, TaskPriority.MEDIUM);
        seedTask(mobile.getId(), "MOB-1", "Evaluate React Native vs native", TaskStatus.IN_REVIEW, TaskPriority.MEDIUM);
        seedTask(mobile.getId(), "MOB-2", "Draft onboarding flow", TaskStatus.TODO, TaskPriority.LOW);
        seedTask(mobile.getId(), "MOB-3", "Push notification spike", TaskStatus.TODO, TaskPriority.LOW);

        logger.info("Seeded {} demo projects and {} demo tasks for tenant {}",
                2, 6, DEMO_TENANT_ID);
    }

    private Project newProject(String name, String code, String description,
                                ProjectStatus status, ProjectPriority priority) {
        Project project = new Project();
        project.setTenantId(DEMO_TENANT_ID);
        project.setName(name);
        project.setCode(code);
        project.setDescription(description);
        project.setStatus(status);
        project.setPriority(priority);
        project.setStartDate(LocalDate.now().minusDays(14));
        return project;
    }

    private void seedTask(java.util.UUID projectId, String taskNumber, String title,
                           TaskStatus status, TaskPriority priority) {
        Task task = new Task();
        task.setTenantId(DEMO_TENANT_ID);
        task.setProjectId(projectId);
        task.setTaskNumber(taskNumber);
        task.setTitle(title);
        task.setStatus(status);
        task.setPriority(priority);
        task.setType(TaskType.TASK);
        task.setDueDate(LocalDateTime.now().plusDays(10));
        taskRepository.save(task);
    }
}
