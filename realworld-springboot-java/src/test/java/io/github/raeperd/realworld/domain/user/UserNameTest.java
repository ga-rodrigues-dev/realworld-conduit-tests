package io.github.raeperd.realworld.domain.user;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserNameTest {

    @Test
    void dumbTest() {
        final var userName = new UserName("name");
        assertThat(userName).isEqualTo(userName).hasSameHashCodeAs(userName);
    }

    @Test
    void when_userName_created_expect_toString_with_name() {
        final var userName = new UserName("name");

        assertThat(userName).hasToString("name");
    }

    @Test
    void when_userName_has_same_name_expect_equal_and_hashcode() {
        final var userName = new UserName("name");
        final var userNameWithSameName = new UserName("name");

        assertThat(userNameWithSameName)
                .isEqualTo(userName)
                .hasSameHashCodeAs(userName);
    }

    @Test
    void when_userName_has_different_name_expect_not_equal() {
        final var userName = new UserName("name");
        final var userNameWithDifferentName = new UserName("name2");

        assertThat(userNameWithDifferentName)
                .isNotEqualTo(userName);
    }

    @Test
    void when_equals_at_null_expect_false(){
        final var userName = new UserName("name");
        assertThat(userName).isNotEqualTo(null);
    }

    @Test
    void when_equals_at_different_class_obj_expect_false() {
        final var userName = new UserName("name");
        assertThat(userName).isNotEqualTo("name");
    }
}