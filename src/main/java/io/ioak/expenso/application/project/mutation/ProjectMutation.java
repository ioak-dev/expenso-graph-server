package io.ioak.expenso.application.project.mutation;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import graphql.schema.DataFetchingEnvironment;
import graphql.servlet.GraphQLContext;
import io.ioak.expenso.application.project.Project;
import io.ioak.expenso.application.project.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

@Component
public class ProjectMutation implements GraphQLMutationResolver {

    @Autowired
    private ProjectRepository projectRepository;

    public Project createProject(final String name, final String reference, final String description, DataFetchingEnvironment env) {
        GraphQLContext context =  env.getContext();
        HttpServletRequest request = context.getHttpServletRequest().get();
        request.getHeader("content-type");

        Project project = new Project();
        project.setName(name);
        project.setReference(reference);
        project.setDescription(description);
        return projectRepository.save(project);
    }
}
