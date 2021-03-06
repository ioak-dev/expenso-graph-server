package io.ioak.expenso.application.project.query;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import io.ioak.expenso.application.project.Project;
import io.ioak.expenso.application.project.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ProjectQuery implements GraphQLQueryResolver {
    @Autowired
    private ProjectRepository projectRepository;


    public Optional<Project> getProject(final String id) {
        return projectRepository.findById(id);
    }
}
