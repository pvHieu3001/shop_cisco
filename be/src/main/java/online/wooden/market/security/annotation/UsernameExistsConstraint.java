package online.wooden.market.security.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import online.wooden.market.security.validation.UsernameExitstsConstrainValidator;

import jakarta.validation.Constraint;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = UsernameExitstsConstrainValidator.class)
public @interface UsernameExistsConstraint {
	String message() default "Email already exists";
	 @SuppressWarnings("rawtypes")
	Class[] groups() default {};
	 @SuppressWarnings("rawtypes")
	Class[] payload() default {};
}
