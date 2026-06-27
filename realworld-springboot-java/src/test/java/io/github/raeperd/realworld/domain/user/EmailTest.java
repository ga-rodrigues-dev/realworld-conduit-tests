package io.github.raeperd.realworld.domain.user;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class EmailTest {

    @Test
    void when_same_address_expect_equal_and_hashCode() {
        final var email = new Email("user@email.com");
        final var sameEmail = new Email("user@email.com");
        assertThat(email)
                .isEqualTo(sameEmail)
                .hasSameHashCodeAs(sameEmail);
    }

    @Test
    void when_user_have_different_email_expect_not_equal() {
        final var anEmail = new Email("user@email.com");
        final var differentEmail = new Email("user2@email.com");

        assertThat(differentEmail)
                .isNotEqualTo(anEmail);
    }

    @Test
    void when_equals_at_null_expect_false(){
        final var email = new Email("user@email.com");
        assertThat(email).isNotEqualTo(null);
    }

    @Test
    void when_equals_at_different_class_obj_expect_false() {
        final var anEmail = new Email("user@email.com");
        assertThat(anEmail).isNotEqualTo("user@email.com");
    }

    @Test
    void when_equals_same_reference_expect_true() {
        final var email = new Email("user@email.com");
        assertThat(email).isEqualTo(email).hasSameHashCodeAs(email);
    }
}