package online.wooden.market.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	private final String resourceFolder;

	public WebConfig(@Qualifier("uploadUrl") String resourceFolder) {
		this.resourceFolder = resourceFolder;
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry){
		registry.addResourceHandler("/uploads/**")
				.addResourceLocations("file:"+resourceFolder+"/");
	}
}
