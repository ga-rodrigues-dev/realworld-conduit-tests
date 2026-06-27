package io.github.raeperd.realworld.domain.user;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ImageTest {

    @Test
    void when_image_created_expect_toString_with_address() {
        final var image = new Image("some-image-address");

        assertThat(image).hasToString("some-image-address");
    }

    @Test
    void when_image_has_same_address_expect_equal_and_hashcode() {
        final var image = new Image("address");
        final var imageWithSameAddress = new Image("address");

        assertThat(imageWithSameAddress)
                .isEqualTo(image)
                .hasSameHashCodeAs(image);
    }

    @Test
    void when_image_has_different_address_expect_not_equal() {
        final var image = new Image("address");
        final var imageWithDifferentAddress = new Image("address2");

        assertThat(imageWithDifferentAddress)
                .isNotEqualTo(image);
    }

    @Test
    void when_equals_at_null_expect_false(){
        final var image = new Image("address");
        assertThat(image).isNotEqualTo(null);
    }

    @Test
    void when_equals_at_different_class_obj_expect_false() {
        final var image = new Image("address");
        assertThat(image).isNotEqualTo("address");
    }

    @Test
    void when_equals_same_reference_expect_true() {
        final var image = new Image("address");
        assertThat(image).isEqualTo(image).hasSameHashCodeAs(image);
    }
}